const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");

const validate = require("../middleware/validate"); // ✅ validate middleware
const { questionArraySchema } = require("../validators/examQuestionValidator"); // ✅ this is the fix

router.post("/", examController.createExam);
router.post("/:examId/questions", validate(questionArraySchema), examController.addQuestionsToExam);

module.exports = router;