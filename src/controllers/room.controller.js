const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find()
    .populate("examId")
    .populate("teacherId")
    .populate("students");
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
