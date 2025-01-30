const express = require('express');
const { createChapter } = require('../controllers/chapterController.js');

const router = express.Router();

router.post('/chapters', createChapter);

module.exports = router;