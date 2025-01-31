const db = require('../config/db');

class ExamOption {
    static async create(examOption) {
        const { exam_question_id, option, isAnswer } = examOption;
        await db.execute(
            'INSERT INTO exam_options (exam_question_id, option, isAnswer) VALUES (?, ?, ?)',
            [exam_question_id, option, isAnswer]
        );
    }
}

module.exports = ExamOption;