const express = require('express');
const { createExamQuestion } = require('../controllers/examQuestionController');

const router = express.Router();

// POST API to create a question for an exam test
router.post('/exam-tests/:exam_test_id/questions', createExamQuestion);

module.exports = router;