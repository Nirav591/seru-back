const Chapter = require('../models/chapter.model');

exports.createChapter = async (req, res) => {
  try {
    const { title, index_number, content } = req.body;

    if (!title || !index_number || !content) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await Chapter.findByTitleOrIndex(title, index_number);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Chapter with the same title or index number already exists.' });
    }

    const result = await Chapter.create({ title, index_number, content });
    res.status(201).json({ message: 'Chapter created', chapterId: result.insertId });
  } catch (err) {
    console.error('Error creating chapter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.getAll();
    res.status(200).json(chapters);
  } catch (err) {
    console.error('Error fetching chapters:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await Chapter.getById(id);

    if (chapter.length === 0) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.status(200).json(chapter[0]);
  } catch (err) {
    console.error('Error fetching chapter:', err);
    res.status(500).json({ message: 'Server error' });
  }
};