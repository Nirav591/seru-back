const Chapter = require('../models/chapterModel');
const { Question, Option } = require('../models/questionModel');
const { questionSchema } = require('../validators/questionValidators');

const createQuestion = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { error } = questionSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { chapter_id, question, type, noOfAnswer, options } = req.body;
        console.log('Extracted Data:', { chapter_id, question, type, noOfAnswer, options });

        const chapter = await Chapter.findById(chapter_id);
        if (!chapter) {
            console.log('Chapter not found with ID:', chapter_id);
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const existingQuestion = await Question.findByChapterAndQuestion(chapter_id, question);
        if (existingQuestion) {
            console.log('Question already exists:', existingQuestion);
            return res.status(400).json({ message: 'Question already exists for this chapter' });
        }

        const questionId = await Question.create({ chapter_id, question, type, noOfAnswer });
        console.log('Question created with ID:', questionId);

        for (const option of options) {
            console.log('Inserting option:', option);
            await Option.create({ question_id: questionId, ...option });
        }

        console.log('Question and options created successfully');
        res.status(201).json({ message: 'Question created successfully' });
    } catch (error) {
        console.error('Error in createQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        console.log('Fetching all questions...');
        const questions = await Question.findAll();
        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in getAllQuestions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getQuestionsByChapterId = async (req, res) => {
    try {
        const { chapter_id } = req.params;
        console.log('Fetching questions for chapter ID:', chapter_id);

        const chapter = await Chapter.findById(chapter_id);
        if (!chapter) {
            console.log('Chapter not found with ID:', chapter_id);
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const questions = await Question.findByChapterId(chapter_id);
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this chapter' });
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in getQuestionsByChapterId:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting question with ID:', id);

        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        await Question.deleteById(id);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error in deleteQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const editQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { chapter_id, question, type, noOfAnswer, options } = req.body;

        console.log('Request Body:', req.body);

        const { error } = questionSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const chapter = await Chapter.findById(chapter_id);
        if (!chapter) {
            console.log('Chapter not found with ID:', chapter_id);
            return res.status(404).json({ message: 'Chapter not found' });
        }

        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            console.log('Question not found with ID:', id);
            return res.status(404).json({ message: 'Question not found' });
        }

        await Question.update(id, { chapter_id, question, type, noOfAnswer });
        console.log('Updating question...');

        await Option.deleteByQuestionId(id);
        console.log('Deleting existing options...');

        for (const option of options) {
            console.log('Inserting option:', option);
            await Option.create({ question_id: id, ...option });
        }

        console.log('Question and options updated successfully');
        res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
        console.error('Error in editQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createQuestion, getAllQuestions, getQuestionsByChapterId, deleteQuestion, editQuestion };
