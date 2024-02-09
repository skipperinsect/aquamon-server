const { Devices, Feedings } = require("../models");

const createFeedings = async (req, res) => {
  try {
    const { code, servo } = req.body;
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

    const feed = await Feedings.create({ code, servo });

    return res.status(200).json({
      feed,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to create Feedings",
    });
  }
};

module.exports = { createFeedings };
