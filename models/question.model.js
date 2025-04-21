const db = require('../config/db');

const Question = {
  create: async ({ chapter_id, question, type, noOfAnswer, options }) => {
    const [qResult] = await db.query(
      'INSERT INTO questions (chapter_id, question, type, no_of_answer) VALUES (?, ?, ?, ?)',
      [chapter_id, question, type, noOfAnswer]
    );
    const questionId = qResult.insertId;

    const optionValues = options.map(o => [questionId, o.option, o.isAnswer]);
    await db.query(
      'INSERT INTO options (question_id, option_text, is_answer) VALUES ?',
      [optionValues]
    );

    return questionId;
  },


  getAllByChapterId: async (chapter_id) => {
    const [questions] = await db.query(
      'SELECT * FROM chapter_questions WHERE chapter_id = ?',
      [chapter_id]
    );

    for (const q of questions) {
      const [options] = await db.query(
        'SELECT * FROM chapter_options WHERE question_id = ?',
        [q.id]
      );

      // 🔁 ✅ RESET OPTION IDs before returning
      q.options = options.map((opt, index) => ({
        id: index + 1, // Override with 1, 2, 3...
        option: opt.option_text,
        isAnswer: Boolean(opt.is_answer)
      }));
    }

    return questions;
  },

  getById: async (id) => {
    const [questions] = await db.query('SELECT * FROM chapter_questions WHERE id = ?', [id]);
    if (!questions.length) return null;

    const [options] = await db.query('SELECT * FROM chapter_options WHERE question_id = ?', [id]);

    questions[0].options = options.map((opt, index) => ({
      id: index + 1,
      option: opt.option_text,
      isAnswer: Boolean(opt.is_answer)
    }));

    return questions[0];
  },

  update: async (id, { question, type, noOfAnswer, options }) => {
    await db.query(
      'UPDATE questions SET question = ?, type = ?, no_of_answer = ? WHERE id = ?',
      [question, type, noOfAnswer, id]
    );

    // Delete old options
    await db.query('DELETE FROM options WHERE question_id = ?', [id]);

    // Insert new options
    const optionValues = options.map(o => [id, o.option, o.isAnswer]);
    await db.query(
      'INSERT INTO options (question_id, option_text, is_answer) VALUES ?',
      [optionValues]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM options WHERE question_id = ?', [id]);
    await db.query('DELETE FROM questions WHERE id = ?', [id]);
  },
  getByChapterAndText: async (chapter_id, questionText) => {
    const [rows] = await db.query(
      'SELECT * FROM questions WHERE chapter_id = ? AND question = ?',
      [chapter_id, questionText]
    );
    return rows;
  },
  findByTextAndChapter: async (chapter_id, questionText) => {
    const [rows] = await db.query(
      'SELECT * FROM questions WHERE chapter_id = ? AND question = ?',
      [chapter_id, questionText]
    );
    return rows;
  }
};

module.exports = Question;