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