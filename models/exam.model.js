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
    const [rows] = await db.query('SELECT * FROM exams');
    return rows;
  }
};

module.exports = Exam;