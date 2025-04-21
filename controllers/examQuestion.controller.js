const ExamQuestion = require('../models/examQuestion.model');

exports.addQuestion = async (req, res) => {
    try {
      const exam_id = req.params.id;
      const questionText = req.body.question.trim();
  
      // Count existing questions for this exam
      const [countResult] = await db.query(
        'SELECT COUNT(*) AS total FROM exam_questions WHERE exam_id = ?',
        [exam_id]
      );
  
      if (countResult[0].total >= 37) {
        return res.status(400).json({ message: 'This exam already has 37 questions.' });
      }
  
      // Check duplicate
      const duplicate = await ExamQuestion.findDuplicate(exam_id, questionText);
      if (duplicate.length > 0) {
        return res.status(409).json({ message: 'Duplicate question exists' });
      }
  
      const questionId = await ExamQuestion.create({ exam_id, ...req.body });
      res.status(201).json({ message: 'Question added', questionId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding question' });
    }
  };

  exports.addBulkQuestions = async (req, res) => {
    const exam_id = req.params.id;
    const questions = req.body;
  
    try {
      const [countResult] = await db.query(
        'SELECT COUNT(*) AS total FROM exam_questions WHERE exam_id = ?',
        [exam_id]
      );
      let total = countResult[0].total;
  
      const created = [], errors = [];
      const seen = new Set();
  
      for (const q of questions) {
        if (total >= 37) {
          errors.push('Max limit of 37 questions reached. Remaining skipped.');
          break;
        }
  
        const text = q.question.trim();
        if (seen.has(text.toLowerCase())) {
          errors.push(`Duplicate in request skipped: "${text}"`);
          continue;
        }
  
        const exists = await ExamQuestion.findDuplicate(exam_id, text);
        if (exists.length > 0) {
          errors.push(`Already exists in DB skipped: "${text}"`);
          continue;
        }
  
        const id = await ExamQuestion.create({ exam_id, ...q });
        created.push(id);
        seen.add(text.toLowerCase());
        total++;
      }
  
      res.status(207).json({ created: created.length, skipped: errors.length, errors });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Bulk insert failed' });
    }
  };

exports.getQuestions = async (req, res) => {
  try {
    const questions = await ExamQuestion.getByExamId(req.params.id);
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await ExamQuestion.getById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    await ExamQuestion.update(req.params.id, req.body);
    res.json({ message: 'Question updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await ExamQuestion.delete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};