const db = require('../config/db');

class Chapter {
    static async create(chapter) {
        const { title, index_number, content } = chapter;
        const [result] = await db.execute(
            'INSERT INTO chapters (title, index_number, content) VALUES (?, ?, ?)',
            [title, index_number, content]
        );
        return result;
    }

    static async findByContent(content) {
        const [rows] = await db.execute('SELECT * FROM chapters WHERE content = ?', [content]);
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM chapters ORDER BY index_number ASC');
        return rows;
    }
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM chapters WHERE id = ?', [id]);
        return rows[0]; // Return the chapter if found
    }
}

module.exports = Chapter;