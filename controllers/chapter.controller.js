const db = require("../db"); // assuming your pool file is db.js

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