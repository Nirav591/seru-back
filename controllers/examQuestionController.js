const ExamQuestion = require('../models/examQuestionModel');
const ExamOption = require('../models/examOptionModel');
const ExamTest = require("../models/examTestModel")
const { examQuestionSchema } = require('../validators/examQuestionValidators');
const db = require('../config/db');

const createExamQuestion = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        // Validate the request body
        const { error } = examQuestionSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message); // Log validation error
            return res.status(400).json({ message: error.details[0].message });
        }

        const { exam_test_id, question, type, noOfAnswer, options } = req.body;
        console.log('Extracted Data:', { exam_test_id, question, type, noOfAnswer, options }); // Log extracted data

        // Check if the question already exists for this exam test
        const existingQuestion = await ExamQuestion.findByExamTestAndQuestion(exam_test_id, question);
        if (existingQuestion) {
            console.log('Question already exists:', existingQuestion); // Log existing question
            return res.status(400).json({ message: 'Question already exists for this exam test' });
        }

        // Create the exam question
        console.log('Creating exam question...');
        const examQuestionId = await ExamQuestion.create({ exam_test_id, question, type, noOfAnswer });
        console.log('Exam question created with ID:', examQuestionId);

        // Create the options
        console.log('Creating options...');
        for (const option of options) {
            console.log('Inserting option:', option); // Log each option
            await ExamOption.create({ exam_question_id: examQuestionId, ...option });
        }

        console.log('Exam question and options created successfully');
        res.status(201).json({ message: 'Exam question created successfully' });
    } catch (error) {
        console.error('Error in createExamQuestion:', error); // Log the full error
        res.status(500).json({ message: 'Server error' });
    }
};

const getExamQuestionsByExamTestId = async (req, res) => {
    try {
        const { exam_test_id } = req.params;
        console.log('Fetching questions for exam test ID:', exam_test_id);

        // Fetch all questions for the given exam test
        const [questions] = await db.execute(
            "SELECT * FROM exam_questions WHERE exam_test_id = ?",
            [exam_test_id]
        );

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam test' });
        }

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const [options] = await db.execute(
                    "SELECT * FROM exam_options WHERE exam_question_id = ?",
                    [question.id]
                );
                return {
                    ...question,
                    options,
                };
            })
        );

        // Get the total number of questions
        const totalQuestions = questions.length;

        res.status(200).json({
            success: true,
            totalQuestions, // Include the total count
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

        // Fetch questions with options for the given exam_test_id
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

        // Fetch all exam tests from the database
        const [examTests] = await db.execute("SELECT * FROM exam_tests ORDER BY created_at DESC");

        if (examTests.length === 0) {
            return res.status(404).json({ message: 'No exam tests found' });
        }

        // Fetch total number of questions for each exam test
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

module.exports = { createExamQuestion, getExamQuestionsByExamTestId, getQuestionsByExamTestId, deleteExamQuestion , getAllExamTests};