const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    date: { type: Date, required: true },
    academicYear: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
