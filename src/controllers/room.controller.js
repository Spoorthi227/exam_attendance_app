const Room = require("../models/Room");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, teacherId, examGroups } = req.body;

    if (!examGroups || examGroups.length < 1 || examGroups.length > 2) {
      return res.status(400).json({
        message: "Room must contain 1 or 2 exam groups"
      });
    }

    // Validate exam groups
    for (const group of examGroups) {
      if (!group.examId || !isValidObjectId(group.examId)) {
        return res.status(400).json({ message: "Invalid examId" });
      }

      if (!group.students || group.students.length === 0) {
        return res.status(400).json({
          message: "Each exam group must have students"
        });
      }

      const invalidStudentIds = group.students.filter(
        id => !isValidObjectId(id)
      );

      if (invalidStudentIds.length) {
        return res.status(400).json({
          message: "Invalid student ObjectId(s)",
          invalidStudentIds
        });
      }

      const count = await Student.countDocuments({
        _id: { $in: group.students }
      });

      if (count !== group.students.length) {
        return res.status(400).json({
          message: "Some students do not exist in DB"
        });
      }
    }

    const room = await Room.create({
      roomNumber,
      teacherId,
      examGroups
    });

    res.status(201).json(room);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find()
    .populate("teacherId")
    .populate("examGroups.examId")
    .populate("examGroups.students");

  res.json(rooms);
};

exports.updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(room);
};

exports.deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: "Room deleted" });
};
