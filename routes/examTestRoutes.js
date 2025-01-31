const express = require('express');
const { createExamTest, getAllExamTests, getExamTestById, deleteExamTestById } = require('../controllers/examTestController');

const router = express.Router();

// POST API to create an exam test
router.post('/exam-tests', createExamTest);

// GET API to fetch all exam tests
router.get('/exam-tests', getAllExamTests);

// GET API to fetch an exam test by ID
router.get('/exam-tests/:id', getExamTestById);

// DELETE API to delete an exam test by ID
router.delete('/exam-tests/:id', deleteExamTestById);

module.exports = router;