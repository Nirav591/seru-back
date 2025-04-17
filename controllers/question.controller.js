const db = require("../config/db");

exports.updateQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { question, type, noOfAnswer, options } = req.body;

    try {
        const [result] = await db.execute(
            "UPDATE questions SET question = ?, type = ?, no_of_answer = ? WHERE id = ?",
            [question, type, noOfAnswer, questionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Remove old options
        await db.execute("DELETE FROM options WHERE question_id = ?", [questionId]);

        // Insert new options
        for (const opt of options) {
            await db.execute(
                "INSERT INTO options (id, question_id, option_text, is_answer) VALUES (?, ?, ?, ?)",
                [opt.id, questionId, opt.option, opt.isAnswer]
            );
        }

        res.status(200).json({ message: "Question updated successfully" });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        // Delete options first due to foreign key
        await db.execute("DELETE FROM options WHERE question_id = ?", [questionId]);

        const [result] = await db.execute("DELETE FROM questions WHERE id = ?", [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};