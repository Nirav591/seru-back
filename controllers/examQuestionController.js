const ExamQuestion = require('../models/examQuestionModel');
const ExamOption = require('../models/examOptionModel');
const { examQuestionSchema } = require('../validators/examQuestionValidators');

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

        const questions = await ExamQuestion.findByExamTestId(exam_test_id);
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam test' });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in getExamQuestionsByExamTestId:', error);
        res.status(500).json({ message: 'Server error' });
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

module.exports = { createExamQuestion, getExamQuestionsByExamTestId, getQuestionsByExamTestId };