const express = require('express');
const { createChapter, getAllChapters, deleteChapter, getChapterById } = require('../controllers/chapterController');

const router = express.Router();

router.post('/chapters', createChapter);
router.get('/chapters', getAllChapters);
router.get('/chapters/:id', getChapterById);

router.delete('/chapters/:id', deleteChapter);

module.exports = router;