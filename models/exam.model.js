const db = require('../config/db');

const Exam = {
  create: async ({ title, description }) => {
    const [result] = await db.query(
      'INSERT INTO exams (title, description) VALUES (?, ?)',
      [title, description]
    );
    return result.insertId;
  },
  getAll: async () => {
    const [exams] = await db.query('SELECT * FROM exams');
  
    for (const exam of exams) {
      const [count] = await db.query(
        'SELECT COUNT(*) AS total FROM exam_questions WHERE exam_id = ?',
        [exam.id]
      );
      exam.totalQuestions = count[0].total;
    }
  
    return exams;
  },

  getByTitle: async (title) => {
    const [rows] = await db.query('SELECT * FROM exams WHERE title = ?', [title]);
    return rows;
  },

  getByIdWithQuestionCount: async (id) => {
    const [rows] = await db.query('SELECT * FROM exams WHERE id = ?', [id]);
    if (!rows.length) return null;
  
    const [count] = await db.query(
      'SELECT COUNT(*) AS total FROM exam_questions WHERE exam_id = ?',
      [id]
    );
  
    rows[0].totalQuestions = count[0].total;
    return rows[0];
  },
  update: async (id, { question, type, noOfAnswer, options }) => {
    await db.query(
      'UPDATE exam_questions SET question = ?, type = ?, no_of_answer = ? WHERE id = ?',
      [question, type, noOfAnswer, id]
    );
  
    // Delete existing options
    await db.query('DELETE FROM exam_options WHERE question_id = ?', [id]);
  
    // Validate options
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error('Options array is required and cannot be empty');
    }
  
    const optionValues = options.map(o => [id, o.option, o.isAnswer]);
    await db.query(
      'INSERT INTO exam_options (question_id, option_text, is_answer) VALUES ?',
      [optionValues]
    );
  },
  
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM exams WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Exam;