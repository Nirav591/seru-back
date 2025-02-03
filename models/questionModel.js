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

    static async findByChapterId(chapter_id) {
        const [questions] = await db.execute(
            'SELECT * FROM questions WHERE chapter_id = ?',
            [chapter_id]
        );

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const [options] = await db.execute(
                    'SELECT * FROM options WHERE question_id = ?',
                    [question.id]
                );
                return {
                    ...question,
                    options,
                };
            })
        );

        return questionsWithOptions;
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM questions ORDER BY created_at DESC');
        return rows; // Return all questions
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM questions WHERE id = ?', [id]);
        return rows[0]; // Return the question if found
    }

    static async deleteById(id) {
        await db.execute('DELETE FROM questions WHERE id = ?', [id]);
    }
    // Update question
    static async updateById(id, updatedData) {
        const { question, type, noOfAnswer } = updatedData;
        await db.execute(
            'UPDATE questions SET question = ?, type = ?, noOfAnswer = ? WHERE id = ?',
            [question, type, noOfAnswer, id]
        );
    }

    // Delete options by question ID (to replace with new ones)
    static async deleteByQuestionId(question_id) {
        await db.execute('DELETE FROM options WHERE question_id = ?', [question_id]);
    }
}

module.exports = Question;


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