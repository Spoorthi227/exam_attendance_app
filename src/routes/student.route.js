const express = require("express");
const router = express.Router();
const controller = require("../controllers/student.controller");

router.post("/", controller.createStudent);
router.get("/", controller.getStudents);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

module.exports = router;
