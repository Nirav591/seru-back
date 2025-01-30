const express = require('express');
const { register, login } = require('../controllers/authController');
const { isAdmin } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/admin-only', isAdmin, (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});

module.exports = router;