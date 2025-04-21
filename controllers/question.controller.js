const Question = require('../models/question.model');

exports.createQuestion = async (req, res) => {
    try {
      const chapter_id = req.params.id;
      const { question, type, noOfAnswer, options } = req.body;
  
      // ✅ Duplicate check
      const existing = await Question.getByChapterAndText(chapter_id, question);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'This question already exists in this chapter.' });
      }
  
      const questionId = await Question.create({ chapter_id, question, type, noOfAnswer, options });
      res.status(201).json({ message: 'Question created', questionId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create question' });
    }
  };

exports.getChapterQuestions = async (req, res) => {
  try {
    const questions = await Question.getAllByChapterId(req.params.id);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.getById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    await Question.update(req.params.id, req.body);
    res.json({ message: 'Question updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.delete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};

exports.createBulkQuestions = async (req, res) => {
    const chapter_id = req.params.id;
    const questions = req.body;
  
    try {
      for (const q of questions) {
        await Question.create({
          chapter_id,
          question: q.question,
          type: q.type,
          noOfAnswer: q.noOfAnswer,
          options: q.options
        });
      }
  
      res.status(201).json({ message: 'Bulk questions created successfully' });
    } catch (err) {
      console.error('Bulk insert error:', err);
      res.status(500).json({ message: 'Error inserting bulk questions' });
    }
  };