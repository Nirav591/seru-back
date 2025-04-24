const db = require('../config/db');

const Exam = {
  // Create a new exam
  create: async ({ title, description, duration }) => {
    const [result] = await db.query(
      'INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)',
      [title, description, duration]
    );
    return result.insertId;
  },

  // Get all exams with question count
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

  // Get exam by title (used for checking duplicates)
  getByTitle: async (title) => {
    const [rows] = await db.query('SELECT * FROM exams WHERE title = ?', [title]);
    return rows;
  },

  // Get exam by ID including total questions
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

  // ✅ Correctly update an exam (title, description, duration)
  update: async (id, { title, description, duration }) => {
    const [result] = await db.query(
      'UPDATE exams SET title = ?, description = ?, duration = ? WHERE id = ?',
      [title, description, duration, id]
    );
    return result;
  },

  // Delete exam by ID
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM exams WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Exam;