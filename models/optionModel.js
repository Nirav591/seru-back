const db = require('../config/db');

class Option {
    static async create(option) {
        const { question_id, option: text, isAnswer } = option;
        await db.execute(
            'INSERT INTO options (question_id, `option`, isAnswer) VALUES (?, ?, ?)',
            [question_id, text, isAnswer]
        ).then(() => {
            console.log('Option successfully inserted');
        }).catch(error => {
            console.error('SQL Error:', error); // Log the error to catch any issues
        });

    }
}

module.exports = { Option };