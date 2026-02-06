// models/RoomAllocation.js
const mongoose = require("mongoose");

const BranchAllocationSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  subject: { type: String, required: true },
  students: [{ type: String }], // USNs
  startUSN: String,
  endUSN: String
});

const RoomAllocationSchema = new mongoose.Schema({
  date: { type: String, required: true },       // "02/06/2025"
  timeSlot: { type: String, required: true },   // "9.30AM - 11.00AM"
  roomNumber: { type: String, required: true },

  facultyId: { type: String, required: true },

  branches: {
    type: [BranchAllocationSchema],
    validate: v => v.length === 2 // exactly 2 branches
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomAllocation", RoomAllocationSchema);
