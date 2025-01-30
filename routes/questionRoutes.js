const express = require('express');
const { createQuestion } = require('../controllers/questionController');

const router = express.Router();

router.post('/questions', createQuestion);

module.exports = router;