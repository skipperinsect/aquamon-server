const express = require("express");

const router = express.Router();

const user = require('./user');
const device = require('./device');
const logdata = require('./logdata');

//Routes
router.use(user, device, logdata);

module.exports = router;