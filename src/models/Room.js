const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true },
    department: { type: String, required: true },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ],
    status: {
      type: String,
      enum: ["active", "locked"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
