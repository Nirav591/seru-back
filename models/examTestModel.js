
const db = require('../config/db');

class ExamTest {
    static async create(examTest) {
        const { title, description, duration } = examTest;
        const [result] = await db.execute(
            'INSERT INTO exam_tests (title, description, duration) VALUES (?, ?, ?)',
            [title, description, duration]
        );
        return result.insertId; // Return the ID of the newly created exam test
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM exam_tests WHERE id = ?', [id]);
        return rows[0]; // Return the exam test if found
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM exam_tests ORDER BY created_at DESC');
        return rows; // Return all exam tests
    }

    static async deleteById(id) {
        await db.execute('DELETE FROM exam_tests WHERE id = ?', [id]);
    }
}

module.exports = ExamTest;