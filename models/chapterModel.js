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
}

module.exports = Chapter;