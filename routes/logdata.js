const express = require("express");

// Middleware
const { createLogData } = require('../controllers/LogDatas');


const router = express.Router();
//Routes

router.post('/logdata', createLogData);
// router.get('/devices', AuthToken, getAllDevices);
// router.get('/devices/status', AuthToken, getAllStatusDevice);

module.exports = router;