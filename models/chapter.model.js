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
    const [rows] = await db.query('SELECT * FROM chapters ORDER BY index_number ASC');
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
  }
};

module.exports = Chapter;