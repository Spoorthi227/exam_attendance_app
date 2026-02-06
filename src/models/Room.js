const mongoose = require("mongoose");

const examGroupSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  department: {
    type: String,
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    }
  ]
}, { _id: false });

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    examGroups: {
      type: [examGroupSchema],
      validate: {
        validator: function (v) {
          return v.length >= 1 && v.length <= 2;
        },
        message: "A room must have 1 or 2 exam groups only"
      }
    },

    status: {
      type: String,
      enum: ["active", "locked"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
