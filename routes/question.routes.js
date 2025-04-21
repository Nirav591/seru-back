const express = require('express');
const router = express.Router();
const controller = require('../controllers/question.controller');

// Create a question under a chapter
router.post('/chapters/:id/questions', controller.createQuestion);

// Get all questions for a chapter
router.get('/chapters/:id/questions', controller.getChapterQuestions);

// Get one question
router.get('/questions/:id', controller.getQuestionById);

// Update question + options
router.put('/questions/:id', controller.updateQuestion);

// Delete question + options
router.delete('/questions/:id', controller.deleteQuestion);

router.post('/chapters/:id/questions/bulk', controller.createBulkQuestions);

module.exports = router;