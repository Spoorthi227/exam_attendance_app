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

exports.getRoomStudents = async (req, res) => {
  try {
    const { roomId } = req.params; // This will be "101"

    // Find the room and populate the students in each exam group
    const room = await Room.findOne({ roomNumber: roomId })
      .populate("examGroups.students");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Combine students from all exam groups in that room into one flat list
    const allStudents = room.examGroups.reduce((acc, group) => {
      return acc.concat(group.students);
    }, []);

    res.status(200).json(allStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherHistory = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // 1. Find history for the teacher
    // 2. Populate 'teacherId' to get the teacher's name
    // 3. Populate 'studentId' inside the students array to get rollNo and name
    const history = await Attendance.find({ teacherId })
      .populate("teacherId", "name")
      .populate("students.studentId", "name rollNo")
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// exports.getTeacherHistory = async (req, res) => {
//   try {
//     const { teacherId } = req.params;
//     const history = await Attendance.find({ teacherId }).sort({ createdAt: -1 });
//     res.status(200).json(history);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.markAttendance = async (req, res) => {
  try {
    const { roomId, attendanceData, teacherId } = req.body;

    // 1. Create a new attendance record
    const newRecord = new Attendance({
      roomId: roomId,
      teacherId: teacherId,
      // Mapping frontend 'isPresent' boolean to backend 'status' string
      students: attendanceData.map(item => ({
        studentId: item.studentId,
        status: item.status // 'present' or 'absent'
      }))
    });

    // 2. Save to MongoDB
    await newRecord.save();

    res.status(200).json({
      success: true,
      message: "Attendance report submitted to the portal successfully."
    });
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.markAttendance = async (req, res) => {
//   const { roomId, examId, markedBy, attendance, date } = req.body;

//   const attendanceDate = date
//     ? new Date(date).setHours(0, 0, 0, 0)
//     : new Date().setHours(0, 0, 0, 0);

//   const records = attendance.map(a => ({
//     studentId: a.studentId,
//     roomId,
//     examId,
//     status: a.status,
//     markedBy,
//     date: attendanceDate
//   }));

//   await Attendance.insertMany(records);

//   res.json({ message: "Attendance marked successfully" });
// };



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

