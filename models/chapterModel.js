const db = require('../config/db');

class Chapter {
    // Create a new chapter
    static async create(chapter) {
        const { title, index_number, content } = chapter;
        try {
            const [result] = await db.execute(
                'INSERT INTO chapters (title, index_number, content) VALUES (?, ?, ?)',
                [title, index_number, content]
            );
            return result;
        } catch (error) {
            console.error('Error inserting chapter:', error);
            throw error;
        }
    }

    // Find a chapter by content
    static async findByContent(content) {
        try {
            const [rows] = await db.execute('SELECT * FROM chapters WHERE content = ?', [content]);
            return rows[0];  
        } catch (error) {
            console.error('Error fetching chapter by content:', error);
            throw error;
        }
    }

    // Find all chapters
    static async findAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM chapters ORDER BY index_number ASC');
            return rows;
        } catch (error) {
            console.error('Error fetching all chapters:', error);
            throw error;
        }
    }

    // Find a chapter by ID
    static async findById(id) {
        try {
            const [rows] = await db.execute('SELECT * FROM chapters WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching chapter by ID:', error);
            throw error;
        }
    }

    // Update chapter by ID
    static async updateById(id, chapter) {
        const { title, index_number, content } = chapter;
        try {
            const [result] = await db.execute(
                'UPDATE chapters SET title = ?, index_number = ?, content = ? WHERE id = ?',
                [title, index_number, content, id]
            );
            return result;
        } catch (error) {
            console.error('Error updating chapter:', error);
            throw error;
        }
    }

    // Delete a chapter by ID
    static async deleteById(id) {
        try {
            await db.execute('DELETE FROM chapters WHERE id = ?', [id]);
        } catch (error) {
            console.error('Error deleting chapter by ID:', error);
            throw error;
        }
    }
}

module.exports = Chapter;
