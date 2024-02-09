const express = require("express");

// Middleware
const { createFeedings } = require("../controllers/Feedings");

const router = express.Router();
//Routes

router.post("/feeding", createFeedings);

module.exports = router;
