const db = require('../config/db');

const Chapter = {
  create: async ({ title, index_number, content }) => {
    const [result] = await db.query(
      'INSERT INTO chapters (title, index_number, content) VALUES (?, ?, ?)',
      [title, index_number, content]
    );
    return result;
  },

  findByTitleOrIndex: async (title, index_number) => {
    const [rows] = await db.query(
      'SELECT * FROM chapters WHERE title = ? OR index_number = ?',
      [title, index_number]
    );
    return rows;
  },

  getAll: async () => {
    const [rows] = await db.query(`
        SELECT c.*, COUNT(q.id) AS questionCount
        FROM chapters c
        LEFT JOIN questions q ON c.id = q.chapter_id
        GROUP BY c.id
        ORDER BY c.index_number ASC
      `);
      return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows;
  },

  update: async (id, { title, index_number, content }) => {
    const [result] = await db.query(
      'UPDATE chapters SET title = ?, index_number = ?, content = ? WHERE id = ?',
      [title, index_number, content, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM chapters WHERE id = ?', [id]);
    return result;
  },
  getByIdWithCount: async (id) => {
    // Get chapter data
    const [chapterRows] = await db.query('SELECT * FROM chapters WHERE id = ?', [id]);
    if (!chapterRows.length) return null;
  
    // Get question count
    const [countRows] = await db.query('SELECT COUNT(*) AS questionCount FROM questions WHERE chapter_id = ?', [id]);
  
    return {
      ...chapterRows[0],
      questionCount: countRows[0].questionCount
    };
  }
};

module.exports = Chapter;