const express = require("express");

const router = express.Router();

const user = require("./user");
const device = require("./device");
const logdata = require("./logdata");
const feeding = require("./feeding");
const google = require("./google");

//Routes
router.use(user, device, logdata, feeding, google);

module.exports = router;
