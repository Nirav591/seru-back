const db = require('../config/db');

class Question {
    static async create(question) {
        const { chapter_id, question: text, type, noOfAnswer } = question;
        const [result] = await db.execute(
            'INSERT INTO questions (chapter_id, question, type, noOfAnswer) VALUES (?, ?, ?, ?)',
            [chapter_id, text, type, noOfAnswer]
        );
        return result.insertId; // Return the ID of the newly created question
    }

    static async findByChapterAndQuestion(chapter_id, question) {
        const [rows] = await db.execute(
            'SELECT * FROM questions WHERE chapter_id = ? AND question = ?',
            [chapter_id, question]
        );
        return rows[0]; // Return the first matching question
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM questions ORDER BY created_at DESC');
        return rows; // Return all questions
    }

    static async findByChapterId(chapter_id) {
        const [rows] = await db.execute('SELECT * FROM questions WHERE chapter_id = ? ORDER BY created_at DESC', [chapter_id]);
        return rows; // Return questions for a specific chapter
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM questions WHERE id = ?', [id]);
        return rows[0]; // Return the question if found
    }

    static async deleteById(id) {
        await db.execute('DELETE FROM questions WHERE id = ?', [id]);
    }
}


class Option {
    static async create(option) {
        const { question_id, option: text, isAnswer } = option;
        await db.execute(
            'INSERT INTO options (question_id, `option`, isAnswer) VALUES (?, ?, ?)',
            [question_id, text, isAnswer]
        );
    }
}

module.exports = { Question, Option };