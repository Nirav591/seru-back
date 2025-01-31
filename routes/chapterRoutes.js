const express = require('express');
const { createChapter , getAllChapters, deleteChapter } = require('../controllers/chapterController.js');


const router = express.Router();

router.post('/chapters', createChapter);
router.get('/chapters', getAllChapters); // Add this route
router.delete('/chapters/:id', deleteChapter);



module.exports = router;