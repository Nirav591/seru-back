const db = require('../config/db');

const ExamQuestion = {
  create: async ({ exam_id, question, type, noOfAnswer, options }) => {
    const [qResult] = await db.query(
      'INSERT INTO exam_questions (exam_id, question, type, no_of_answer) VALUES (?, ?, ?, ?)',
      [exam_id, question, type, noOfAnswer]
    );

    const questionId = qResult.insertId;

    const optionValues = options.map(o => [id, o.option, o.isAnswer]);
    await db.query(
      'INSERT INTO exam_options (question_id, option_text, is_answer) VALUES ?',
      [optionValues]
    );

    return questionId;
  },

  getByExamId: async (exam_id) => {
    const [questions] = await db.query(
      'SELECT * FROM exam_questions WHERE exam_id = ?',
      [exam_id]
    );

    for (const q of questions) {
      const [options] = await db.query(
        'SELECT * FROM exam_options WHERE question_id = ?',
        [q.id]
      );
      q.options = options;
    }

    return questions;
  },

  getById: async (id) => {
    const [questions] = await db.query('SELECT * FROM exam_questions WHERE id = ?', [id]);
    if (!questions.length) return null;

    const [options] = await db.query('SELECT * FROM exam_options WHERE question_id = ?', [id]);
    questions[0].options = options;
    return questions[0];
  },

  findDuplicate: async (exam_id, questionText) => {
    const [rows] = await db.query(
      'SELECT * FROM exam_questions WHERE exam_id = ? AND question = ?',
      [exam_id, questionText]
    );
    return rows;
  },

  update: async (id, { question, type, noOfAnswer, options }) => {
    await db.query(
      'UPDATE exam_questions SET question = ?, type = ?, no_of_answer = ? WHERE id = ?',
      [question, type, noOfAnswer, id]
    );

    await db.query('DELETE FROM exam_options WHERE question_id = ?', [id]);

    const optionValues = options.map(o => [id, o.option, o.isAnswer]);
    await db.query(
      'INSERT INTO exam_options (question_id, option_text, is_answer) VALUES ?',
      [optionValues]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM exam_options WHERE question_id = ?', [id]);
    await db.query('DELETE FROM exam_questions WHERE id = ?', [id]);
  }
};

module.exports = ExamQuestion;