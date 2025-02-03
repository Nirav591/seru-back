const express = require('express');
const router = express.Router();
const { createQuestion, getAllQuestions, getQuestionsByChapterId, deleteQuestion, editQuestion } = require('../controllers/questionController');

router.post('/questions', createQuestion);
router.get('/questions', getAllQuestions);
router.get('/questions/:chapter_id', getQuestionsByChapterId);
router.delete('/questions/:id', deleteQuestion);
router.put('/questions/:id', editQuestion);

module.exports = router;