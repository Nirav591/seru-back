const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const questionController = require('../controllers/examQuestion.controller');

// Exam routes
router.post('/exams', examController.createExam);
router.get('/exams', examController.getAllExams);

// Questions
router.post('/exams/:id/questions', questionController.addQuestion);
router.post('/exams/:id/questions/bulk', questionController.addBulkQuestions);
router.get('/exams/:id/questions', questionController.getQuestions);
router.get('/exam-questions/:id', questionController.getQuestionById);
router.put('/exam-questions/:id', questionController.updateQuestion);
router.delete('/exam-questions/:id', questionController.deleteQuestion);
router.get('/exams/:id', examController.getExamById);

module.exports = router;