const Exam = require('../models/exam.model');

exports.createExam = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    // Required field check
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    // Check for duplicate title
    const existing = await Exam.getByTitle(title.trim());
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An exam with this title already exists.' });
    }

    // Create exam
    const examId = await Exam.create({
      title: title.trim(),
      description: description.trim(),
      duration: duration || 45
    });

    res.status(201).json({ message: 'Exam created successfully', examId });
  } catch (err) {
    console.error('Create Exam Error:', err);
    res.status(500).json({ message: 'Failed to create exam' });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.getAll();
    res.status(200).json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.getByIdWithQuestionCount(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch exam' });
  }
};