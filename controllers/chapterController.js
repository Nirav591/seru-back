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

const getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();
        res.status(200).json({ chapters });
    } catch (error) {
        console.error('Error in getAllChapters:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting chapter with ID:', id);

        // Check if the chapter exists
        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Delete the chapter
        await Chapter.deleteById(id);
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error('Error in deleteChapter:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { createChapter , getAllChapters, deleteChapter};