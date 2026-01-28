const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendance.controller");

router.get("/teacher/:teacherId/rooms", controller.getTeacherRooms);

router.post("/mark", controller.markAttendance);

router.get("/room/:roomId", controller.getRoomAttendance);

module.exports = router;
