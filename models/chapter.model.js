const db = require('../config/db');

const Chapter = {
  create: (chapterData, callback) => {
    const { title, index_number, content } = chapterData;
    const query = 'INSERT INTO chapters (title, index_number, content) VALUES (?, ?, ?)';
    db.query(query, [title, index_number, content], callback);
  },

  // New method to check duplicates
  findByTitleOrIndex: (title, index_number, callback) => {
    const query = 'SELECT * FROM chapters WHERE title = ? OR index_number = ?';
    db.query(query, [title, index_number], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM chapters ORDER BY index_number ASC';
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = 'SELECT * FROM chapters WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Chapter;