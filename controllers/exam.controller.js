const db = require("../config/db");

exports.createExam = async (req, res) => {
  const { title, description, duration } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ message: "Title and duration are required" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)",
      [title, description, duration]
    );

    res.status(201).json({
      message: "Exam created successfully",
      examId: result.insertId,
    });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.addQuestionsToExam = async (req, res) => {
    const examId = req.params.examId;
    const questions = req.body;
  
    try {
      // Check current question count
      const [existing] = await db.execute("SELECT COUNT(*) AS count FROM exam_questions WHERE exam_id = ?", [examId]);
      const currentCount = existing[0].count;
  
      if (currentCount + questions.length > 37) {
        return res.status(400).json({ message: "Cannot add more than 37 questions to the exam" });
      }
  
      for (const q of questions) {
        // Insert question
        await db.execute(
          "INSERT INTO exam_questions (id, exam_id, question, type, no_of_answer) VALUES (?, ?, ?, ?, ?)",
          [q.id, examId, q.question, q.type, q.noOfAnswer]
        );
  
        // Insert options
        for (const opt of q.options) {
          await db.execute(
            "INSERT INTO exam_options (id, question_id, option_text, is_answer) VALUES (?, ?, ?, ?)",
            [opt.id, q.id, opt.option, opt.isAnswer]
          );
        }
      }
  
      res.status(201).json({ message: "Questions added to exam successfully" });
    } catch (error) {
      console.error("DB Error:", error);
      res.status(500).json({ message: "Failed to add questions", error });
    }
  };