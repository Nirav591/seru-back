const db = require('../config/db');

class ExamOption {
    static async create(examOption) {
        const { exam_question_id, option, isAnswer } = examOption;

        // Check if required fields are present
        if (!exam_question_id || !option || isAnswer === undefined) {
            throw new Error('Missing required fields: exam_question_id, option, or isAnswer');
        }

        await db.execute(
            'INSERT INTO exam_options (exam_question_id, `option`, isAnswer) VALUES (?, ?, ?)', // Escaped here
            [exam_question_id, option, isAnswer]
        );
    }
}

module.exports = ExamOption;
