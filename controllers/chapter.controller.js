const db = require("../config/db"); // assuming your pool file is db.js

exports.createChapter = async (req, res) => {
    const { title, index_number, content } = req.body;

    if (!title || !index_number) {
        return res.status(400).json({ message: "Title and index_number are required" });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO chapters (title, index_number, content) VALUES (?, ?, ?)",
            [title, index_number, content]
        );

        res.status(201).json({
            message: "Chapter created successfully",
            chapterId: result.insertId,
        });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getChapterById = async (req, res) => {
    const chapterId = req.params.id;

    try {
        const [rows] = await db.execute("SELECT * FROM chapters WHERE id = ?", [chapterId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateChapter = async (req, res) => {
    const chapterId = req.params.id;
    const { title, index_number, content } = req.body;

    try {
        const [result] = await db.execute(
            "UPDATE chapters SET title = ?, index_number = ?, content = ? WHERE id = ?",
            [title, index_number, content, chapterId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json({ message: "Chapter updated successfully" });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllChapters = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM chapters ORDER BY index_number ASC");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteChapter = async (req, res) => {
    const chapterId = req.params.id;

    try {
        const [result] = await db.execute("DELETE FROM chapters WHERE id = ?", [chapterId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        res.status(200).json({ message: "Chapter deleted successfully" });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addQuestionsToChapter = async (req, res) => {
    const chapterId = req.params.chapterId;
    const questions = req.body;

    try {
        for (const q of questions) {
            // Insert question
            await db.execute(
                "INSERT INTO questions (id, chapter_id, question, type, no_of_answer) VALUES (?, ?, ?, ?, ?)",
                [q.id, chapterId, q.question, q.type, q.noOfAnswer]
            );

            // Insert options
            for (const opt of q.options) {
                await db.execute(
                    "INSERT INTO options (id, question_id, option_text, is_answer) VALUES (?, ?, ?, ?)",
                    [opt.id, q.id, opt.option, opt.isAnswer]
                );
            }
        }

        res.status(201).json({ message: "Questions and options added successfully" });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Failed to add questions", error });
    }
};

exports.getQuestionsByChapter = async (req, res) => {
    const chapterId = req.params.id;

    try {
        const [questions] = await db.execute(
            "SELECT * FROM questions WHERE chapter_id = ?",
            [chapterId]
        );

        for (let question of questions) {
            const [options] = await db.execute(
                "SELECT id, option_text, is_answer FROM options WHERE question_id = ?",
                [question.id]
            );
            question.options = options;
        }

        res.status(200).json(questions);
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getFullChapter = async (req, res) => {
    const chapterId = req.params.id;
  
    try {
      // Fetch chapter details
      const [chapterRows] = await db.execute("SELECT * FROM chapters WHERE id = ?", [chapterId]);
  
      if (chapterRows.length === 0) {
        return res.status(404).json({ message: "Chapter not found" });
      }
  
      const chapter = chapterRows[0];
  
      // Fetch all questions under this chapter
      const [questions] = await db.execute("SELECT * FROM questions WHERE chapter_id = ?", [chapterId]);
  
      // Fetch options for each question
      for (let question of questions) {
        const [options] = await db.execute(
          "SELECT id, option_text, is_answer FROM options WHERE question_id = ?",
          [question.id]
        );
        question.options = options;
      }
  
      // Nest questions inside the chapter
      chapter.questions = questions;
  
      res.status(200).json(chapter);
    } catch (error) {
      console.error("DB error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };