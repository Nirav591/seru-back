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
        const [questions] = await db.execute(
            'SELECT * FROM exam_questions WHERE exam_test_id = ?',
            [exam_test_id]
        );

        // Fetch options for each question
        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const [options] = await db.execute(
                    'SELECT * FROM exam_options WHERE exam_question_id = ?',
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

    static async findByExamTestAndQuestion(exam_test_id, question) {
        const [rows] = await db.execute(
            'SELECT * FROM exam_questions WHERE exam_test_id = ? AND question = ?',
            [exam_test_id, question]
        );
        return rows[0]; // Return the first matching question
    }

    static async deleteById(exam_question_id) {
        try {
            // Delete options first (if they exist)
            await db.execute('DELETE FROM exam_options WHERE exam_question_id = ?', [exam_question_id]);
    
            // Delete the question
            const [result] = await db.execute('DELETE FROM exam_questions WHERE id = ?', [exam_question_id]);
    
            return result.affectedRows > 0; // Return true if deleted, false if not found
        } catch (error) {
            throw error;
        }
    }
    

}

module.exports = ExamQuestion;