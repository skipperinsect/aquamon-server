const { Devices } = require("../../models");

const re_name = /^[a-zA-Z0-9 ]+$/;
const RE_HTML_ERROR = /<[\s\S]*?>/;

const AuthDevices = async (req, res, next) => {
  const { name, code } = req.body;

  const codeExiting = await Devices.findOne({
    where: {
      code,
    },
  });

  if (name.match(RE_HTML_ERROR) || code.match(RE_HTML_ERROR)) {
    return res.status(400).send({
      message: "Dont write HTML Tag on Field",
    });
  }

  if (codeExiting) {
    return res.status(412).send({
      message: "Code has been register",
    });
  }

  if (name.search(re_name) === -1) {
    return res.status(412).send({
      message: "First name doesnt match with Format",
    });
  }

  if (code.search(re_name) === -1) {
    return res.status(412).send({
      message: "First name doesnt match with Format",
    });
  }

  data_device = {
    name,
    code,
  };

  next();
};

module.exports = { AuthDevices };
