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

        // ✅ Extra validation for FILL_BLANK
        if (type === 'FILL_BLANK') {
            const placeholderMatches = question.match(/{{\d+}}/g) || [];
            const correctOptionsCount = options.filter(opt => opt.isAnswer === true || opt.isAnswer === 'true').length;

            if (placeholderMatches.length !== noOfAnswer) {
                return res.status(400).json({
                    message: "Number of placeholders in question doesn't match 'noOfAnswer'"
                });
            }

            if (correctOptionsCount !== noOfAnswer) {
                return res.status(400).json({
                    message: "Number of correct options doesn't match 'noOfAnswer'"
                });
            }
        }

        console.log('Creating question...');
        const questionId = await Question.create({ chapter_id, question, type, noOfAnswer });
        console.log('Question created with ID:', questionId);

        console.log('Creating options...');
        for (const option of options) {
            const isAnswer = option.isAnswer === true || option.isAnswer === 'true';
            await Option.create({ question_id: questionId, option: option.option, isAnswer });
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
  
      // For each question, get its options
      const questionsWithOptions = await Promise.all(
        questions.map(async (q) => {
          const options = await Option.findByQuestionId(q.id);
          return {
            ...q,
            options,
          };
        })
      );
  
      res.status(200).json({ questions: questionsWithOptions });
    } catch (error) {
      console.error('Error in getAllQuestions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Get questions by chapter ID
const getQuestionsByChapterId = async (req, res) => {
    try {
        const { chapter_id } = req.params;
        console.log('Fetching questions for chapter ID:', chapter_id);

        // Check if the chapter exists
        const chapter = await Chapter.findById(chapter_id);
        if (!chapter) {
            console.log('Chapter not found with ID:', chapter_id); // Log chapter not found
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Fetch questions with options for the given chapter_id
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

        // Check if the question exists
        const question = await Question.findById(id); // Ensure this method is defined
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Delete the question
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
        const { question, type, noOfAnswer, options } = req.body;
        console.log('Editing question with ID:', id);

        // Check if the question exists
        const existingQuestion = await Question.findById(id);
        if (!existingQuestion) {
            console.log('Question not found with ID:', id);
            return res.status(404).json({ message: 'Question not found' });
        }

        // Update the question
        console.log('Updating question...');
        await Question.updateById(id, { question, type, noOfAnswer });
        console.log('Question updated successfully');

        // Delete existing options and add updated ones
        console.log('Deleting existing options...');
        await Option.deleteByQuestionId(id); // This should now work
        for (const option of options) {
            console.log('Inserting option:', option);
            await Option.create({ question_id: id, ...option });
        }

        console.log('Options updated successfully');
        res.status(200).json({ message: 'Question and options updated successfully' });
    } catch (error) {
        console.error('Error in editQuestion:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createQuestion, getAllQuestions, getQuestionsByChapterId, deleteQuestion, editQuestion };
