const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");

router.post("/", examController.createExam);

router.post("/:examId/questions", validate(questionArraySchema), examController.addQuestionsToExam);


module.exports = router;