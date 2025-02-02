const express = require('express');
const { createChapter, getAllChapters, deleteChapter, getChapter } = require('../controllers/chapterController');

const router = express.Router();

router.post('/chapters', createChapter);
router.get('/chapters', getAllChapters);
router.get('/chapters/:id', getChapter)
router.delete('/chapters/:id', deleteChapter);

module.exports = router;