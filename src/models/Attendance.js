const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // The room number (e.g., "101")
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  date: { type: Date, default: Date.now },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      status: { type: String, enum: ["present", "absent"], required: true },
      remarks: { type: String, default: "" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
//   roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
//   examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
//   status: { type: String, enum: ["present", "absent"], required: true },
//   markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//   date: { type: Date, required: true }
// }, { timestamps: true });


// module.exports = mongoose.model("Attendance", attendanceSchema);
