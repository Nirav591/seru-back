const { Question, Option } = require('../models/questionModel');
const { questionSchema } = require('../validators/questionValidators');

const createQuestion = async (req, res) => {
    try {
        // Validate the request body
        const { error } = questionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { chapter_id, question, type, noOfAnswer, options } = req.body;

        // Create the question
        const questionId = await Question.create({ chapter_id, question, type, noOfAnswer });

        // Create the options
        for (const option of options) {
            await Option.create({ question_id: questionId, ...option });
        }

        res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
        console.error('Error in createQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createQuestion };