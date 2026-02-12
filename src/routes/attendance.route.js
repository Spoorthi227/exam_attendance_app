const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendance.controller");

router.get("/teacher/:teacherId/rooms", controller.getTeacherRooms);

router.post("/mark", controller.markAttendance);

router.get("/room/:roomId", controller.getRoomAttendance);

router.get("/room/:roomId/students", controller.getRoomStudents);

router.get("/history/:teacherId", controller.getTeacherHistory);

module.exports = router;
