const ExamTest = require('../models/examTestModel');
const { examTestSchema } = require('../validators/examTestValidators');

// Create a new exam test
const createExamTest = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body

        // Validate the request body
        const { error } = examTestSchema.validate(req.body);
        if (error) {
            console.log('Validation Error:', error.details[0].message); // Log validation error
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, description, duration } = req.body;
        console.log('Extracted Data:', { title, description, duration }); // Log extracted data

        // Create the exam test
        const examTestId = await ExamTest.create({ title, description, duration });
        console.log('Exam test created with ID:', examTestId);

        // Calculate totalQuestions for the newly created exam test
        const totalQuestions = await ExamTest.getTotalQuestions(examTestId);
        console.log('Total Questions:', totalQuestions);

        res.status(201).json({ message: 'Exam test created successfully', id: examTestId, totalQuestions });
    } catch (error) {
        console.error('Error in createExamTest:', error); // Log the full error
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all exam tests
const getAllExamTests = async (req, res) => {
    try {
        console.log('Fetching all exam tests...');
        const examTests = await ExamTest.findAll();

        // Include totalQuestions for each exam test
        const examTestsWithTotalQuestions = await Promise.all(
            examTests.map(async (examTest) => {
                const totalQuestions = await ExamTest.getTotalQuestions(examTest.id);
                return { 
                    id: examTest.id, 
                    title: examTest.title, 
                    description: examTest.description, 
                    duration: examTest.duration, 
                    created_at: examTest.created_at, 
                    totalQuestions: totalQuestions || 0 // Ensure totalQuestions is always a number
                };
            })
        );

        res.status(200).json({ examTests: examTestsWithTotalQuestions });
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

        // Calculate totalQuestions for the exam test
        const totalQuestions = await ExamTest.getTotalQuestions(id);

        res.status(200).json({ examTest: { ...examTest, totalQuestions } });
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

const deleteExamTest = async (req, res) => {
    try {
        const { exam_test_id } = req.params;
        console.log(`Deleting exam test with ID: ${exam_test_id}`);

        // Check if the exam test exists
        const [examTest] = await db.execute("SELECT * FROM exam_tests WHERE id = ?", [exam_test_id]);
        if (examTest.length === 0) {
            return res.status(404).json({ message: "Exam test not found" });
        }

        // Delete all questions associated with this exam test
        await db.execute("DELETE FROM exam_questions WHERE exam_test_id = ?", [exam_test_id]);

        // Delete the exam test itself
        await db.execute("DELETE FROM exam_tests WHERE id = ?", [exam_test_id]);

        res.status(200).json({ success: true, message: "Exam test deleted successfully" });

    } catch (error) {
        console.error("Error in deleteExamTest:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { createExamTest, getAllExamTests, getExamTestById, deleteExamTestById, deleteExamTest };
