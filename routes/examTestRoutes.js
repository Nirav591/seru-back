const express = require('express');
const {
  createExamTest,
  getAllExamTests,
  getExamTestById,
  deleteExamTestById,
  deleteExamTest
} = require('../controllers/examTestController');

const { createQuestion } = require('../controllers/questionController'); // ✅ Corrected

const router = express.Router();

router.post('/add-question', createQuestion); // ✅ Now it works

router.post('/exam-tests', createExamTest);
router.get('/exam-tests', getAllExamTests);
router.get('/exam-tests/:id', getExamTestById);
router.delete('/exam-tests/:id', deleteExamTestById);
router.delete('/exam-tests/:exam_test_id', deleteExamTest);

module.exports = router;