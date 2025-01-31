const ExamTest = require('../models/examTestModel');
const { examTestSchema } = require('../validators/examTestValidators');

// Create a new exam test
const createExamTest = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        // Validate the request body
        const { error } = examTestSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, description, duration } = req.body;
        console.log('Extracted Data:', { title, description, duration });

        // Create the exam test
        const examTestId = await ExamTest.create({ title, description, duration });
        console.log('Exam test created with ID:', examTestId);

        res.status(201).json({ message: 'Exam test created successfully', id: examTestId });
    } catch (error) {
        console.error('Error in createExamTest:', error);
        res.status(500).json({ message: 'Server error', error: error.message });  // Detailed error message for debugging
    }
};

// Get all exam tests
const getAllExamTests = async (req, res) => {
    try {
        console.log('Fetching all exam tests...');
        const examTests = await ExamTest.findAll();
        res.status(200).json({ examTests });
    } catch (error) {
        console.error('Error in getAllExamTests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get an exam test by ID
const getExamTestById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Fetching exam test with ID:', id);

        const examTest = await ExamTest.findById(id);
        if (!examTest) {
            return res.status(404).json({ message: 'Exam test not found' });
        }

        res.status(200).json({ examTest });
    } catch (error) {
        console.error('Error in getExamTestById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an exam test by ID
const deleteExamTestById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting exam test with ID:', id);

        // Check if the exam test exists
        const examTest = await ExamTest.findById(id);
        if (!examTest) {
            return res.status(404).json({ message: 'Exam test not found' });
        }

        // Delete the exam test
        await ExamTest.deleteById(id);
        res.status(200).json({ message: 'Exam test deleted successfully' });
    } catch (error) {
        console.error('Error in deleteExamTestById:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createExamTest, getAllExamTests, getExamTestById, deleteExamTestById };