const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");

const validate = require("../middleware/validate");
const { questionArraySchema } = require("../validators/examQuestionValidator");

router.post("/", examController.createExam);
router.post("/:examId/questions", validate(questionArraySchema), examController.addQuestionsToExam);

module.exports = router;