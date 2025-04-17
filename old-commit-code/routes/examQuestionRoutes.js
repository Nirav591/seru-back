const express = require('express');
const { createExamQuestion, getExamQuestionsByExamTestId, deleteExamQuestion } = require('../controllers/examQuestionController');
const { getAllExamTests } = require('../controllers/examTestController');

const router = express.Router();

// POST API to create a question for an exam test
router.post('/exam-tests/:exam_test_id/questions', createExamQuestion);

// GET API to fetch questions with options and total count
router.get('/exam-tests/:exam_test_id/questions', getExamQuestionsByExamTestId);

// DELETE API to remove a question by ID
router.delete('/exam-questions/:exam_question_id', deleteExamQuestion);

router.get('/exam-tests', getAllExamTests);


module.exports = router;
