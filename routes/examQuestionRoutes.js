const express = require('express');
const { createExamQuestion , getExamQuestionsByExamTestId} = require('../controllers/examQuestionController');

const router = express.Router();

// POST API to create a question for an exam test
router.post('/exam-tests/:exam_test_id/questions', createExamQuestion);
router.get('/exam-tests/:exam_test_id/questions', getQuestionsByExamTestId);

router.get('/exam-tests/:exam_test_id/questions', getExamQuestionsByExamTestId);

module.exports = router;