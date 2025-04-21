const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapter.controller');

router.post('/chapters', chapterController.createChapter);
router.get('/chapters', chapterController.getAllChapters);
router.get('/chapters/:id', chapterController.getChapterById);
router.put('/chapters/:id', chapterController.updateChapter); // ✅ Update
router.delete('/chapters/:id', chapterController.deleteChapter); // ✅ Delete

module.exports = router;