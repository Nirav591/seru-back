const Chapter = require('../models/chapter.model');

exports.createChapter = (req, res) => {
    const { title, index_number, content } = req.body;

    if (!title || !index_number || !content) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for duplicate index_number or title
    Chapter.findByTitleOrIndex(title, index_number, (err, results) => {
        if (err) {
            console.error('Error checking duplicates:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Chapter with the same title or index number already exists.' });
        }

        // If not duplicate, proceed to insert
        Chapter.create({ title, index_number, content }, (err, result) => {
            if (err) {
                console.error('MySQL Error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'Chapter created', chapterId: result.insertId });
        });
    });
};

exports.getAllChapters = (req, res) => {
    Chapter.getAll((err, results) => {
        if (err) {
            console.error('MySQL Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);
    });
};

// Get chapter by ID
exports.getChapterById = (req, res) => {
    const { id } = req.params;

    Chapter.getById(id, (err, results) => {
        if (err) {
            console.error('MySQL Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.status(200).json(results[0]);
    });
};