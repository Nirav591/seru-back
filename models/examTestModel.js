const db = require('../config/db');

class ExamTest {
    static async create(examTest) {
        const { title, description, duration } = examTest;
        const [result] = await db.execute(
            'INSERT INTO exam_tests (title, description, duration) VALUES (?, ?, ?)',
            [title, description, duration]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM exam_tests WHERE id = ?', [id]);
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM exam_tests ORDER BY created_at DESC');
        return rows;
    }

    static async deleteById(id) {
        await db.execute('DELETE FROM exam_tests WHERE id = ?', [id]);
    }

    // ✅ Add this method
    static async getTotalQuestions(examTestId) {
        const [rows] = await db.execute(
            'SELECT COUNT(*) AS totalQuestions FROM questions WHERE exam_test_id = ?',
            [examTestId]
        );
        return rows[0]?.totalQuestions || 0;
    }
}

// ✅ Make sure you are exporting the class correctly
module.exports = ExamTest;