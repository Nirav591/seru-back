const ExamTest = require('../models/examTestModel');
const { examTestSchema } = require('../validators/examTestValidators');
const db = require('../config/db'); // ✅ required for deleteExamTest

// Create a new exam test
const createExamTest = async (req, res) => {
  try {
    const { error } = examTestSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, duration } = req.body;
    const examTestId = await ExamTest.create({ title, description, duration });
    const totalQuestions = await ExamTest.getTotalQuestions(examTestId);

    res.status(201).json({ message: 'Exam test created successfully', id: examTestId, totalQuestions });
  } catch (error) {
    console.error('Error in createExamTest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all exam tests
const getAllExamTests = async (req, res) => {
  try {
    const examTests = await ExamTest.findAll();
    if (!examTests || examTests.length === 0) {
      return res.status(404).json({ message: 'No exam tests found' });
    }

    const examTestsWithTotalQuestions = await Promise.all(
      examTests.map(async (examTest) => {
        const totalQuestions = await ExamTest.getTotalQuestions(examTest.id);
        return { ...examTest, totalQuestions };
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
    const examTest = await ExamTest.findById(id);
    if (!examTest) {
      return res.status(404).json({ message: 'Exam test not found' });
    }

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
    const examTest = await ExamTest.findById(id);
    if (!examTest) {
      return res.status(404).json({ message: 'Exam test not found' });
    }

    await ExamTest.deleteById(id);
    res.status(200).json({ message: 'Exam test deleted successfully' });
  } catch (error) {
    console.error('Error in deleteExamTestById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete exam test + questions by exam_test_id
const deleteExamTest = async (req, res) => {
  try {
    const { exam_test_id } = req.params;
    const [examTest] = await db.execute("SELECT * FROM exam_tests WHERE id = ?", [exam_test_id]);

    if (examTest.length === 0) {
      return res.status(404).json({ message: "Exam test not found" });
    }

    await db.execute("DELETE FROM exam_questions WHERE exam_test_id = ?", [exam_test_id]);
    await db.execute("DELETE FROM exam_tests WHERE id = ?", [exam_test_id]);

    res.status(200).json({ success: true, message: "Exam test deleted successfully" });
  } catch (error) {
    console.error("Error in deleteExamTest:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ ADD THIS: Create a question (for /add-question route)
const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    // Replace this with DB logic to insert into `exam_questions` table
    console.log('New Question:', { question, options, correctAnswer });
    res.status(201).json({ message: 'Question added successfully' });
  } catch (error) {
    console.error('Error in createQuestion:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export all
module.exports = {
  createExamTest,
  getAllExamTests,
  getExamTestById,
  deleteExamTestById,
  deleteExamTest,
  createQuestion // ✅ Now defined and exported properly
};