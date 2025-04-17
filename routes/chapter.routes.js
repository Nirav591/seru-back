const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");

router.post("/", chapterController.createChapter);
router.get("/", chapterController.getAllChapters);          // ✅ GET all
router.get("/:id", chapterController.getChapterById);
router.put("/:id", chapterController.updateChapter);
router.delete("/:id", chapterController.deleteChapter);     // ✅ DELETE

module.exports = router;