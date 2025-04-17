const Chapter = require('../models/chapterModel');
const { Question } = require('../models/questionModel');
const { chapterSchema } = require('../validators/chapterValidators');

// Create chapter
const createChapter = async (req, res) => {
    try {
        const { error } = chapterSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { title, index_number, content } = req.body;

        // Check if content already exists
        const existingChapter = await Chapter.findByContent(content);
        if (existingChapter) {
            return res.status(400).json({ message: 'Chapter with the same content already exists' });
        }

        await Chapter.create({ title, index_number, content });
        res.status(201).json({ message: 'Chapter created successfully' });
    } catch (error) {
        console.error('Error in createChapter:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all chapters
const getAllChapters = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();

        // Add question count to each chapter
        const chaptersWithQuestionCount = await Promise.all(
            chapters.map(async (chapter) => {
                const questionCount = await Question.countByChapterId(chapter.id);
                return {
                    ...chapter,
                    questionCount,
                };
            })
        );

        res.status(200).json({ chapters: chaptersWithQuestionCount });
    } catch (error) {
        console.error('Error in getAllChapters:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get chapter by ID
const getChapterById = async (req, res) => {
    try {
        const { id } = req.params;
        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Add question count to the chapter
        const questionCount = await Question.countByChapterId(id);
        const chapterWithQuestionCount = {
            ...chapter,
            questionCount,
        };

        res.status(200).json({ chapter: chapterWithQuestionCount });
    } catch (error) {
        console.error('Error in getChapterById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Edit chapter
const editChapter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, index_number, content } = req.body;

        // Validate the request body
        const { error } = chapterSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Check if the chapter exists
        const existingChapter = await Chapter.findById(id);
        if (!existingChapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Update the chapter
        await Chapter.updateById(id, { title, index_number, content });
        res.status(200).json({ message: 'Chapter updated successfully' });
    } catch (error) {
        console.error('Error in editChapter:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete chapter
const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        const chapter = await Chapter.findById(id);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        await Chapter.deleteById(id);
        res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (error) {
        console.error('Error in deleteChapter:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createChapter, getAllChapters, getChapterById, editChapter, deleteChapter };
