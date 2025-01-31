const db = require('../config/db');

class ExamOption {
    static async create(examOption) {
        const { exam_question_id, option_text, isAnswer } = examOption;
        await db.execute(
            'INSERT INTO exam_options (exam_question_id, option_text, isAnswer) VALUES (?, ?, ?)',
            [exam_question_id, option_text, isAnswer]
        );
    }
}

module.exports = ExamOption;