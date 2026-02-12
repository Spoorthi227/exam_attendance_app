const mongoose = require("mongoose");

// 1. Define the sub-schema for the exam group
const examGroupSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam", // MUST match the model name in your Exam.js file
    required: true
  },
  department: { type: String, required: true },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student" // Matches the "Student" model in image_cff85d.png
  }]
});

// 2. Use that sub-schema in your main roomSchema
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  examGroups: [examGroupSchema], // Use the schema defined above
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Room", roomSchema);

// const mongoose = require("mongoose");

// const examGroupSchema = new mongoose.Schema({
//   examId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Exam", // This allows .populate('examId') to work
//     required: true
//   },
//   department: { type: String, required: true },
//   students: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student" // Matches the model name in your Student.js (image_cff85d.png)
//   }]
// });

// const roomSchema = new mongoose.Schema({
//   roomNumber: { type: String, required: true },
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   examGroups: [examGroupSchema], // Now Mongoose knows how to populate inside here
//   status: {
//     type: String,
//     enum: ["active", "locked"],
//     default: "active"
//   }
// },
//   { timestamps: true }
// );


// module.exports = mongoose.model("Room", roomSchema);
