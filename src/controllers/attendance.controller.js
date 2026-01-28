const Attendance = require("../models/Attendance");
const Room = require("../models/Room");

exports.getTeacherRooms = async (req, res) => {
  const { teacherId } = req.params;

  const rooms = await Room.find({ teacherId })
    .populate("examId")
    .populate("students");

  res.json(rooms);
};

exports.markAttendance = async (req, res) => {
  const { roomId, examId, markedBy, attendance, date } = req.body;

  const attendanceDate = date
    ? new Date(date).setHours(0, 0, 0, 0)
    : new Date().setHours(0, 0, 0, 0);

  const records = attendance.map(a => ({
    studentId: a.studentId,
    roomId,
    examId,
    status: a.status,
    markedBy,
    date: attendanceDate
  }));

  await Attendance.insertMany(records);

  res.json({ message: "Attendance marked successfully" });
};



exports.getRoomAttendance = async (req, res) => {
  const { roomId } = req.params;
  const { date } = req.query;

  const query = { roomId };

  if (date) {
    query.date = new Date(date).setHours(0, 0, 0, 0);
  }

  const data = await Attendance.find(query)
    .populate("studentId")
    .populate("markedBy");

  res.json(data);
};

