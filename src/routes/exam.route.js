const express = require("express");
const router = express.Router();
const controller = require("../controllers/exam.controller");

// ADMIN
router.post("/", controller.createExam);
router.put("/:id", controller.updateExam);
router.delete("/:id", controller.deleteExam);

// ADMIN / FACULTY
router.get("/", controller.getExams);
router.get("/:id", controller.getExamById);

module.exports = router;
