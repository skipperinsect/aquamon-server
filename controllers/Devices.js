const { Devices, LogDatas } = require("../models");

const createDevice = async (req, res) => {
  try {
    const { name, code } = data_device;
    const device = await Devices.create({ name, code });

    return res.status(200).json({
      data: device,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to create device",
    });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const devices = await Devices.findAll();
    return res.status(200).json({
      data: devices,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to get all device",
    });
  }
};

const getAllStatusDevice = async (req, res) => {
  try {
    const devices = await Devices.findAll({
      include: [
        {
          model: LogDatas,
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
    });

    const formattedDevices = devices.map((device) => ({
      code: device.code,
      name: device.name,
      status: device.LogDatas.length > 0 ? device.LogDatas[0] : null,
    }));

    return res.status(200).json({
      data: formattedDevices,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to get all device",
    });
  }
};

const getAllLogWithCode = async (req, res) => {
  try {
    const { code } = req.params;

    const { page = 1, pageSize = 10 } = req.query;

    const totalLogDataCount = await LogDatas.count({
      where: { code },
    });

    const totalPages = Math.ceil(totalLogDataCount / pageSize);

    const device = await Devices.findOne({
      where: { code },
      include: [
        {
          model: LogDatas,
          order: [["createdAt", "DESC"]],
          offset: (page - 1) * pageSize,
          limit: pageSize,
        },
      ],
    });

    const status = await LogDatas.findOne({
      where: { code },
      order: [["createdAt", "DESC"]],
    });

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    return res.status(200).json({
      content: device,
      status,
      totalPages,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(500).json({
      message: "Failed to get all Log",
    });
  }
};

module.exports = {
  createDevice,
  getAllStatusDevice,
  getAllDevices,
  getAllLogWithCode,
};
