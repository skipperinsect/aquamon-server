const { Devices, LogDatas, LogErrors } = require("../models");

const createLogData = async (req, res) => {
  try {
    const { code, tds, temp, status } = req.body;
    const device = await Devices.findOne({
      where: {
        code,
      },
    });

    if (!device) {
      return res.status(412).send({
        message: "Device not found!",
      });
    }
    const logData = await LogDatas.create({ code, tds, temp, status });

    return res.status(200).json({
      logData,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    await LogErrors.create({
      Log: `${req.method} ${req.originalUrl} : ${error.message}`,
    });
    return res.status(400).json({
      message: "Failed to create log datas",
    });
  }
};

module.exports = { createLogData };
