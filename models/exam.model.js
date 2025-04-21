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
  }
};

module.exports = Exam;