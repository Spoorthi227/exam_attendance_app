const express = require("express");
const router = express.Router();
const controller = require("../controllers/formA.controller");

router.get("/:roomId", controller.downloadFormA);

module.exports = router;
