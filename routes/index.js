const express = require("express");

const router = express.Router();

const user = require("./user");
const device = require("./device");
const logdata = require("./logdata");
const feeding = require("./feeding");

//Routes
router.use(user, device, logdata, feeding);

module.exports = router;
