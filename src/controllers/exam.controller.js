const Exam = require("../models/Exam");

/**
 * ADMIN: Create exam
 */
exports.createExam = async (req, res) => {
  try {
    const { examName, date, academicYear } = req.body;

    const exam = await Exam.create({
      examName,
      date: new Date(date),
      academicYear
    });

    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Failed to create exam" });
  }
};

/**
 * ADMIN / FACULTY: Get all exams
 */
exports.getExams = async (req, res) => {
  const exams = await Exam.find().sort({ date: 1 });
  res.json(exams);
};

/**
 * ADMIN: Get single exam
 */
exports.getExamById = async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  res.json(exam);
};

/**
 * ADMIN: Update exam
 */
exports.updateExam = async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(exam);
};

/**
 * ADMIN: Delete exam
 */
exports.deleteExam = async (req, res) => {
  await Exam.findByIdAndDelete(req.params.id);
  res.json({ message: "Exam deleted" });
};
