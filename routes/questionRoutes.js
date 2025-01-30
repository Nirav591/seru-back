const express = require('express');
const { createQuestion } = require('../controllers/questionController');

const router = express.Router();

router.post('/questions', createQuestion);

router.get('/questions', getAllQuestions);

router.get('/questions/chapter/:chapter_id', getQuestionsByChapterId);


module.exports = router;