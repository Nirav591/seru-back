const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/authValidators');

const register = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, email, password, type } = req.body;

        console.log('Checking if user exists...'); // Log progress
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        console.log('Hashing password...'); // Log progress
        const hashedPassword = await hashPassword(password);

        console.log('Creating user...'); // Log progress
        await User.create({ username, email, password: hashedPassword, type });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    console.log("login");
    
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };