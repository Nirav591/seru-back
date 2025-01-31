const ExamQuestion = require('../models/examQuestionModel');
const ExamOption = require('../models/examOptionModel');
const { examQuestionSchema } = require('../validators/examQuestionValidators');

const createExamQuestion = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        // Validate request body
        const { error } = examQuestionSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { exam_test_id, question, type, noOfAnswer, options } = req.body;
        console.log('Extracted Data:', { exam_test_id, question, type, noOfAnswer, options });

        // Validate options array
        if (!Array.isArray(options) || options.length === 0) {
            console.error("Error: options array is missing or empty:", options);
            return res.status(400).json({ message: "Options are required." });
        }

        // Create the exam question
        const examQuestionId = await ExamQuestion.create({ exam_test_id, question, type, noOfAnswer });
        if (!examQuestionId) {
            console.error("Error: Exam question ID is undefined.");
            return res.status(500).json({ message: "Failed to create exam question." });
        }
        console.log('Exam question created with ID:', examQuestionId);

        // Insert options
        console.log('Creating options...');
        for (const option of options) {
            const { option_text, isAnswer } = option;
            if (!option_text) {
                console.error("Error: Missing option_text", option);
                return res.status(400).json({ message: "Each option must have text." });
            }

            console.log('Inserting option:', option);
            await ExamOption.create({ exam_question_id: examQuestionId, option_text, isAnswer });
        }

        console.log('Exam question and options created successfully');
        res.status(201).json({ message: 'Exam question created successfully' });
    } catch (error) {
        console.error('Error in createExamQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createExamQuestion };