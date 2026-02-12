const mongoose = require("mongoose");

const examGroupSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam", // This allows .populate('examId') to work
    required: true
  },
  department: { type: String, required: true },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student" // Matches the model name in your Student.js (image_cff85d.png)
  }]
});

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examGroups: [examGroupSchema], // Now Mongoose knows how to populate inside here
  status: {
    type: String,
    enum: ["active", "locked"],
    default: "active"
  }
},
  { timestamps: true }
);


module.exports = mongoose.model("Room", roomSchema);
