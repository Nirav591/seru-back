const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapter.controller');

router.post('/chapters', chapterController.createChapter);
router.get('/chapters', chapterController.getAllChapters);
router.get('/chapters/:id', chapterController.getChapterById);

module.exports = router;