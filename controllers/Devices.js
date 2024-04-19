const { Devices, LogDatas, Feedings } = require("../models");
const { Sequelize } = require("sequelize");

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

const checkStatus = async (code, startAt, endAt) => {
  try {
    console.log(startAt);
    const feedingStatus = await Feedings.findOne({
      where: {
        code: code,
        createdAt: {
          [Sequelize.Op.between]: [
            startAt.toISOString().split(".")[0],
            endAt.toISOString().split(".")[0],
          ],
        },
      },
    });

    return {
      status: !!feedingStatus,
      feed: feedingStatus,
    };
  } catch (error) {
    console.error("Error while checking status:", error);
    throw new Error("Failed to check feeding status");
  }
};

const calculateTimeRange = () => {
  const nowISOString = new Date().toISOString();
  const now = new Date(nowISOString);

  const startAt = new Date(now);
  const endAt = new Date(now);

  if (now.getHours() >= 9 && now.getHours() < 13) {
    startAt.setHours(9, 0, 0);
    endAt.setHours(13, 0, 0);
  } else if (now.getHours() >= 13 && now.getHours() < 17) {
    startAt.setHours(13, 0, 0);
    endAt.setHours(17, 0, 0);
  } else {
    startAt.setHours(17, 0, 0);
    endAt.setHours(9, 0, 0);
    endAt.setDate(endAt.getDate() + 1);
  }

  return { startAt, endAt, now, hours: now.getHours() };
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

    const formattedDevices = await Promise.all(
      devices.map(async (device) => {
        const { startAt, endAt } = calculateTimeRange();
        const feeding = await checkStatus(device.code, startAt, endAt);

        const status = device.LogDatas.length > 0 ? device.LogDatas[0] : null;

        if (status) {
          status.dataValues.feeding = feeding;
        }

        return {
          code: device.code,
          name: device.name,
          status,
        };
      })
    );

    return res.status(200).json({
      data: formattedDevices,
    });
  } catch (error) {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to get all device",
    });
  }
};

const getAllLogWithCode = async (req, res) => {
  try {
    const { code } = req.params;
    let { page = 1, pageSize = 10 } = req.query;

    page = parseInt(page);
    pageSize = parseInt(pageSize);

    const totalLogDataCount = await LogDatas.count({
      where: { code: code }, // Update this line
    });

    const totalPages = Math.ceil(totalLogDataCount / pageSize);

    const offset = (page - 1) * pageSize;

    const device = await Devices.findOne({
      where: { code: code }, // Update this line
      include: [
        {
          model: LogDatas,
          order: [["createdAt", "DESC"]],
          offset,
          limit: pageSize,
        },
      ],
    });

    const { startAt, endAt, now, hours } = calculateTimeRange();
    const feeding = await checkStatus(code, startAt, endAt);

    const status = await LogDatas.findOne({
      where: { code: code },
      order: [["createdAt", "DESC"]],
    });

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    if (status) {
      status.dataValues.feeding = feeding.status;
      status.dataValues.feed = feeding.feed;
      status.dataValues.date = {
        startAt,
        endAt,
        now,
        hours,
      };
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

const deleteDevice = async (req, res) => {
  try {
    const { code } = req.params;

    const deleteCount = await Devices.destroy({
      where: { code },
    });

    if (deleteCount < 1) {
      return res.status(401).json({
        message: "The Devices was not properly deleted.",
      });
    }

    return res.status(200).json({
      message: "Devices has been deleted",
    });
  } catch (error) {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(500).json({
      message: "Failed to delete device",
    });
  }
};

const updateDevice = async (req, res) => {
  try {
    const { name } = req.body;
    const { code } = req.params;

    const updateCount = await Devices.update({ name }, { where: { code } });

    if (updateCount < 1) {
      return res.status(401).json({
        message: "Device not yet update",
      });
    }

    return res.status(200).json({
      message: "Device has been update!",
    });
  } catch (error) {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(500).json({
      message: "Failed to edit device",
    });
  }
};

module.exports = {
  createDevice,
  getAllStatusDevice,
  getAllDevices,
  getAllLogWithCode,
  deleteDevice,
  updateDevice,
};
