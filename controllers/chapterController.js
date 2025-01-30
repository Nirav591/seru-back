const Chapter = require('../models/chapterModel');
const { chapterSchema } = require('../validators/chapterValidators');

const createChapter = async (req, res) => {
    try {
        // Validate the request body
        const { error } = chapterSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { title, index_number, content } = req.body;

        // Check if the content already exists
        const existingChapter = await Chapter.findByContent(content);
        if (existingChapter) {
            return res.status(400).json({ message: 'Chapter with the same content already exists' });
        }

        // Create the new chapter
        await Chapter.create({ title, index_number, content });

        res.status(201).json({ message: 'Chapter created successfully' });
    } catch (error) {
        console.error('Error in createChapter:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createChapter };