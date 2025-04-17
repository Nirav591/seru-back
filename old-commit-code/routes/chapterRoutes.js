const express = require('express');
const { createChapter, getAllChapters, getChapterById, editChapter, deleteChapter } = require('../controllers/chapterController');

const router = express.Router();

router.post('/chapters', createChapter);
router.get('/chapters', getAllChapters);
router.get('/chapters/:id', getChapterById);
router.put('/chapters/:id', editChapter);  // Added editChapter route
router.delete('/chapters/:id', deleteChapter);

module.exports = router;
