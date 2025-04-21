const db = require('../config/db'); // Make sure this is the promise version

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
    const [rows] = await db.query('SELECT * FROM chapters ORDER BY index_number ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows;
  }
};

module.exports = Chapter;