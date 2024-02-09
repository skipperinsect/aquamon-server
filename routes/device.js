const express = require("express");

// Middleware
const { AuthAdmin, AuthToken } = require("../middlewares/AuthLogin");
const { AuthDevices } = require("../middlewares/AuthBody/DeviceBody");

const {
  createDevice,
  getAllDevices,
  getAllStatusDevice,
  getAllLogWithCode,
  deleteDevice,
  updateDevice,
} = require("../controllers/Devices");

const router = express.Router();
//Routes

router.post("/devices", AuthAdmin, AuthDevices, createDevice);
router.get("/devices", AuthToken, getAllDevices);
router.get("/devices/log/:code", AuthToken, getAllLogWithCode);
router.get("/devices/status", AuthToken, getAllStatusDevice);
router.delete("/devices/:code", AuthAdmin, deleteDevice);
router.put("/devices/:code", AuthAdmin, updateDevice);

module.exports = router;
