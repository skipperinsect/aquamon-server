const express = require("express");

// Middleware
const { createLogData } = require("../controllers/LogDatas");

const router = express.Router();
//Routes

router.post("/logdata", createLogData);

module.exports = router;
