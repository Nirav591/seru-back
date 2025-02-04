const getExamQuestionsByExamTestId = async (req, res) => {
    try {
        const { exam_test_id } = req.params;
        console.log('Fetching questions for exam test ID:', exam_test_id);

        const questions = await ExamQuestion.findByExamTestId(exam_test_id);
        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for this exam test' });
        }

        // Fetch options for each question
        for (let question of questions) {
            question.options = await ExamQuestion.getOptionsByQuestionId(question.id);
        }

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error in getExamQuestionsByExamTestId:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const db = require('../config/db');

class ExamQuestion {
    static async create(examQuestion) {
        const { exam_test_id, question, type, noOfAnswer } = examQuestion;
        const [result] = await db.execute(
            'INSERT INTO exam_questions (exam_test_id, question, type, noOfAnswer) VALUES (?, ?, ?, ?)',
            [exam_test_id, question, type, noOfAnswer]
        );
        return result.insertId; // Return the ID of the newly created question
    }

    static async findByExamTestId(exam_test_id) {
        const [rows] = await db.execute('SELECT * FROM exam_questions WHERE exam_test_id = ?', [exam_test_id]);
        return rows; // Return all questions for the exam test
    }

    static async findByExamTestAndQuestion(exam_test_id, question) {
        const [rows] = await db.execute(
            'SELECT * FROM exam_questions WHERE exam_test_id = ? AND question = ?',
            [exam_test_id, question]
        );
        return rows[0]; // Return the first matching question
    }

    static async getOptionsByQuestionId(question_id) {
        const [rows] = await db.execute(
            'SELECT id, question_id, `option`, isAnswer FROM question_options WHERE question_id = ?',
            [question_id]
        );
        return rows; // Return all options for the question
    }
}

module.exports = ExamQuestion;
