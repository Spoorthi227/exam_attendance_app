const Room = require("../models/Room");
const Attendance = require("../models/Attendance");

exports.downloadFormA = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate("teacherId", "name email")
      .populate("examGroups.examId", "examName date")
      .populate("examGroups.students", "name rollNo department");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Fetch attendance (if any)
    const attendance = await Attendance.find({ roomId })
      .populate("studentId", "name rollNo")
      .populate("examId", "examName");

    
    const formA = {
      roomNumber: room.roomNumber,
      teacher: room.teacherId,
      examGroups: room.examGroups.map(group => ({
        exam: group.examId,
        students: group.students.map(s => ({
          id: s._id,
          name: s.name,
          rollNo: s.rollNo,
          attendance: attendance.find(
            a =>
              a.studentId._id.equals(s._id) &&
              a.examId._id.equals(group.examId._id)
          )?.status || "not_marked"
        }))
      }))
    };

    res.json(formA);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate FORM-A" });
  }
};
