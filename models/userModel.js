const db = require('../config/db');

class User {
    static async create(user) {
        const { username, email, password, type } = user;
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, type) VALUES (?, ?, ?, ?)',
            [username, email, password, type]
        );
        return result;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
}

module.exports = User;