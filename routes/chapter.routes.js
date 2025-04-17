const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");

router.post("/", chapterController.createChapter);
router.get("/:id", chapterController.getChapterById);     // <-- GET by ID
router.put("/:id", chapterController.updateChapter);      // <-- PUT (update)

module.exports = router;