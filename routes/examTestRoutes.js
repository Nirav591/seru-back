const express = require('express');
const {
  createExamTest,
  getAllExamTests,
  getExamTestById,
  deleteExamTestById,
  deleteExamTest,
  createQuestion // ✅ include it here directly
} = require('../controllers/examTestController');

const router = express.Router();

// ✅ Question Route
router.post('/add-question', createQuestion);

// ✅ Exam Test Routes
router.post('/exam-tests', createExamTest);
router.get('/exam-tests', getAllExamTests);
router.get('/exam-tests/:id', getExamTestById);
router.delete('/exam-tests/:id', deleteExamTestById);
router.delete('/exam-tests/:exam_test_id', deleteExamTest); // This one might overlap, double check logic

module.exports = router;