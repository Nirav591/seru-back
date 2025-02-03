const express = require('express');
const { createQuestion , getAllQuestions, getQuestionsByChapterId , deleteQuestion} = require('../controllers/questionController');

const router = express.Router();

router.post('/questions', createQuestion);

router.get('/questions', getAllQuestions);

router.get('/questions/chapter/:chapter_id', getQuestionsByChapterId);

router.delete('/questions/:id', deleteQuestion);






module.exports = router;