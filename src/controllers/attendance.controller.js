const Attendance = require("../models/Attendance");
const Room = require("../models/Room");

exports.getTeacherRooms = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const rooms = await Room.find({ teacherId })
      .populate('examGroups.examId'); // This matches the path in the schema above

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

exports.getRoomStudents = async (req, res) => {
  try {
    const { roomId } = req.params; // This is "101"

    // Find the room by its number and populate the students array
    const room = await Room.findOne({ roomNumber: roomId })
      .populate("examGroups.students");

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Combine students from all exam groups in that room into one list
    const allStudents = room.examGroups.reduce((acc, group) => {
      return acc.concat(group.students);
    }, []);

    res.status(200).json(allStudents);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

