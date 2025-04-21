const db = require("../config/db");

exports.createExam = async (req, res) => {
    const { title, description, duration } = req.body;

    if (!title || !duration) {
        return res.status(400).json({ message: "Title and duration are required" });
    }

    try {
        // Check if an exam with the same title exists
        const [existing] = await db.execute("SELECT * FROM exams WHERE title = ?", [title]);

        if (existing.length > 0) {
            return res.status(409).json({ message: "An exam with this title already exists" });
        }

        const [result] = await db.execute(
            "INSERT INTO exams (title, description, duration) VALUES (?, ?, ?)",
            [title, description, duration]
        );

        res.status(201).json({ message: "Exam created successfully", examId: result.insertId });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addQuestionsToExam = async (req, res) => {
    const examId = req.params.examId;
    const questions = req.body;

    try {
        // Get current question count for the exam
        const [existingCount] = await db.execute(
            "SELECT COUNT(*) AS count FROM exam_questions WHERE exam_id = ?",
            [examId]
        );

        const currentCount = existingCount[0].count;

        if (currentCount + questions.length > 37) {
            return res.status(400).json({ message: "Cannot add more than 37 questions to the exam" });
        }

        for (const q of questions) {
            // ✅ DUPLICATE CHECK
            const [exists] = await db.execute(
                "SELECT * FROM exam_questions WHERE exam_id = ? AND question = ?",
                [examId, q.question]
            );

            if (exists.length > 0) {
                return res.status(409).json({
                    message: `Duplicate question: "${q.question}" already exists in this exam`
                });
            }

            // Insert question
            await db.execute(
                "INSERT INTO exam_questions (exam_id, question, type, no_of_answer) VALUES (?, ?, ?, ?)",
                [examId, q.question, q.type, q.noOfAnswer]
            );

            // Get inserted question's ID (if you're using AUTO_INCREMENT)
            const [lastInsert] = await db.execute("SELECT LAST_INSERT_ID() as id");
            const questionId = lastInsert[0].id;

            // Insert options
            for (const opt of q.options) {
                await db.execute(
                    "INSERT INTO exam_options (question_id, option_text, is_answer) VALUES (?, ?, ?)",
                    [questionId, opt.option, opt.isAnswer]
                );
            }
        }

        res.status(201).json({ message: "Questions added to exam successfully" });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Failed to add questions", error });
    }
};

// GET all exams
exports.getAllExams = async (req, res) => {
    try {
        const [exams] = await db.execute("SELECT * FROM exams ORDER BY id DESC");
        res.status(200).json(exams);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET exam by ID
exports.getExamById = async (req, res) => {
    const examId = req.params.id;

    try {
        // 1. Get exam
        const [examRows] = await db.execute("SELECT * FROM exams WHERE id = ?", [examId]);
        if (examRows.length === 0) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const exam = examRows[0];

        // 2. Get questions linked to this exam
        const [questions] = await db.execute("SELECT * FROM exam_questions WHERE exam_id = ?", [examId]);

        // 3. Attach options to each question
        for (const question of questions) {
            const [options] = await db.execute(
                "SELECT id, option_text, is_answer FROM exam_options WHERE question_id = ?",
                [question.id]
            );
            question.options = options;
        }

        // 4. Attach questions and question count to the exam
        exam.questions = questions;
        exam.question_count = questions.length;

        res.status(200).json(exam);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteExamQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        // Delete options first due to foreign key constraint
        await db.execute("DELETE FROM exam_options WHERE question_id = ?", [questionId]);

        const [result] = await db.execute("DELETE FROM exam_questions WHERE id = ?", [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateExamQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { question, type, noOfAnswer, options } = req.body;

    try {
        // Update question fields
        const [updateResult] = await db.execute(
            "UPDATE exam_questions SET question = ?, type = ?, no_of_answer = ? WHERE id = ?",
            [question, type, noOfAnswer, questionId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Delete old options
        await db.execute("DELETE FROM exam_options WHERE question_id = ?", [questionId]);

        // Insert new options
        for (const opt of options) {
            await db.execute(
                "INSERT INTO exam_options (id, question_id, option_text, is_answer) VALUES (?, ?, ?, ?)",
                [opt.id, questionId, opt.option, opt.isAnswer]
            );
        }

        res.status(200).json({ message: "Question updated successfully" });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};