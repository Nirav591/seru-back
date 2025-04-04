const ExamQuestion = require('../models/examQuestionModel');
const ExamOption = require('../models/examOptionModel');
const ExamTest = require("../models/examTestModel");
const { examQuestionSchema } = require('../validators/examQuestionValidators');
const db = require('../config/db');

const createExamQuestion = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { exam_test_id, question, type, noOfAnswer, options } = req.body;
        console.log('Extracted Data:', { exam_test_id, question, type, noOfAnswer, options });

        // ✅ Check if exam_test_id exists
        const [examTest] = await db.execute("SELECT id FROM exam_tests WHERE id = ?", [exam_test_id]);
        if (examTest.length === 0) {
            return res.status(400).json({ message: "Invalid exam_test_id: No such exam test exists." });
        }

        // ✅ Check if the question already exists for this exam test
        const existingQuestion = await ExamQuestion.findByExamTestAndQuestion(exam_test_id, question);
        if (existingQuestion) {
            console.log('Question already exists:', existingQuestion);
            return res.status(400).json({ message: 'Question already exists for this exam test' });
        }

        // ✅ Extra Validation for FILL_BLANK
        if (type === 'fill_in_blank') {
            const placeholderMatches = question.match(/{{\d+}}/g) || [];
            const correctOptionsCount = options.filter(opt => opt.isAnswer === true || opt.isAnswer === 'true').length;

            if (placeholderMatches.length !== noOfAnswer) {
                return res.status(400).json({ message: "Number of placeholders in question doesn't match 'noOfAnswer'" });
            }

            if (correctOptionsCount !== noOfAnswer) {
                return res.status(400).json({ message: "Number of correct options doesn't match 'noOfAnswer'" });
            }
        }

        // ✅ Insert the exam question
        console.log('Creating exam question...');
        const examQuestionId = await ExamQuestion.create({ exam_test_id, question, type, noOfAnswer });
        console.log('Exam question created with ID:', examQuestionId);

        // ✅ Insert options
        console.log('Creating options...');
        for (const option of options) {
            console.log('Inserting option:', option);
            const isAnswer = option.isAnswer === true || option.isAnswer === 'true';
            await ExamOption.create({
                exam_question_id: examQuestionId,
                option: option.option,
                isAnswer
            });
        }

        res.status(201).json({ message: 'Exam question created successfully' });

    } catch (error) {
        console.error('Error in createExamQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getExamQuestionsByExamTestId = async (req, res) => {
    try {
        const { exam_test_id } = req.params;
        console.log('Fetching questions for exam test ID:', exam_test_id);

        const [questions] = await db.execute(
            "SELECT * FROM exam_questions WHERE exam_test_id = ?",
            [exam_test_id]
        );

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam test' });
        }

        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const [options] = await db.execute(
                    "SELECT * FROM exam_options WHERE exam_question_id = ?",
                    [question.id]
                );

                const formattedOptions = options.map(opt => ({
                    id: opt.id,
                    option: opt.option,
                    isAnswer: !!opt.isAnswer
                }));

                return {
                    id: question.id,
                    question: question.question,
                    type: question.type,
                    noOfAnswer: question.noOfAnswer,
                    options: formattedOptions
                };
            })
        );

        res.status(200).json({
            success: true,
            totalQuestions: questions.length,
            exam_test_id,
            questions: questionsWithOptions
        });

    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getQuestionsByExamTestId = async (req, res) => {
    try {
        const { exam_test_id } = req.params;
        console.log('Fetching questions for exam test ID:', exam_test_id);

        const questions = await ExamQuestion.findByExamTestId(exam_test_id);
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam test' });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in getQuestionsByExamTestId:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteExamQuestion = async (req, res) => {
    try {
        const { exam_question_id } = req.params;

        const deleted = await ExamQuestion.deleteById(exam_question_id);
        if (!deleted) {
            return res.status(404).json({ message: 'Exam question not found' });
        }

        res.status(200).json({ message: 'Exam question deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam question:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllExamTests = async (req, res) => {
    try {
        console.log('Fetching all exam tests...');

        const [examTests] = await db.execute("SELECT * FROM exam_tests ORDER BY created_at DESC");

        if (examTests.length === 0) {
            return res.status(404).json({ message: 'No exam tests found' });
        }

        const examTestsWithTotalQuestions = await Promise.all(
            examTests.map(async (examTest) => {
                const [questionCount] = await db.execute(
                    "SELECT COUNT(*) AS totalQuestions FROM exam_questions WHERE exam_test_id = ?",
                    [examTest.id]
                );
                return {
                    ...examTest,
                    totalQuestions: questionCount[0]?.totalQuestions || 0
                };
            })
        );

        res.status(200).json({
            success: true,
            totalTests: examTests.length,
            examTests: examTestsWithTotalQuestions
        });

    } catch (error) {
        console.error('Error in getAllExamTests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createExamQuestion,
    getExamQuestionsByExamTestId,
    getQuestionsByExamTestId,
    deleteExamQuestion,
    getAllExamTests
};