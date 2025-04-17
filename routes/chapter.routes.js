const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");
const { questionsArraySchema } = require("../validators/questionValidator");


router.post("/", chapterController.createChapter);
router.get("/", chapterController.getAllChapters);          // ✅ GET all
router.get("/:id", chapterController.getChapterById);
router.put("/:id", chapterController.updateChapter);
router.delete("/:id", chapterController.deleteChapter); 
router.post("/:chapterId/questions", chapterController.addQuestionsToChapter);
router.get("/:id/questions", chapterController.getQuestionsByChapter);
router.get("/:id/full", chapterController.getFullChapter);
router.post("/:chapterId/questions", validate(questionsArraySchema), chapterController.addQuestionsToChapter);

module.exports = router;