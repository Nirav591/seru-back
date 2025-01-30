const { Question, Option } = require('../models/questionModel');
const { questionSchema } = require('../validators/questionValidators');

const createQuestion = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        // Validate the request body
        const { error } = questionSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message); // Log validation error
            return res.status(400).json({ message: error.details[0].message });
        }

        const { chapter_id, question, type, noOfAnswer, options } = req.body;
        console.log('Extracted Data:', { chapter_id, question, type, noOfAnswer, options }); // Log extracted data

        // Create the question
        console.log('Creating question...');
        const questionId = await Question.create({ chapter_id, question, type, noOfAnswer });
        console.log('Question created with ID:', questionId);

        // Create the options
        console.log('Creating options...');
        for (const option of options) {
            console.log('Inserting option:', option); // Log each option
            await Option.create({ question_id: questionId, ...option });
        }

        console.log('Question and options created successfully');
        res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
        console.error('Error in createQuestion:', error); // Log the full error
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createQuestion };