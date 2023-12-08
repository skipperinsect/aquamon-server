const { Users } = require("../../models");
const bcrypt = require("bcrypt");

const re_name = /^[a-zA-Z0-9 ]+$/;
const re_password = /^[a-zA-Z0-9]{2,30}$/;
const RE_HTML_ERROR = /<[\s\S]*?>/;
const re_email = /^[a-zA-Z0-9@.]+$/;

const AuthReg = async (req, res, next) => {
  const { name, email, password, repassword } = req.body;

  const emailAuth = await Users.findOne({
    where: {
      email: email,
    },
  });

  if (
    name.match(RE_HTML_ERROR) ||
    email.match(RE_HTML_ERROR) ||
    password.match(RE_HTML_ERROR)
  ) {
    return res.status(400).send({
      message: "Dont write HTML Tag on Field",
    });
  }

  if (emailAuth) {
    return res.status(412).send({
      message: "Email has been register",
    });
  }

  if (name.search(re_name) === -1) {
    return res.status(412).send({
      message: "First name doesnt match with Format",
    });
  }

  if (password.search(re_password) === -1) {
    return res.status(412).send({
      message: "The format of the Password does not match.",
    });
  }

  if (!email.includes("@") || email.search(re_email) === -1) {
    return res.status(412).send({
      message: "Fill your email with real email",
    });
  }

  if (password !== repassword) {
    return res.status(412).send({
      message: "The passwords do not match.",
    });
  }

  data_user = {
    name,
    email,
    password,
  };

  next();
};

const AuthLog = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(412).send({
      message: "Email not Registered",
    });
  }

  if (!user.verified) {
    return res.status(412).send({
      message: "Your account cannot verify. Check Email First!",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Wrong Password" });
  }

  data_user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
};

module.exports = { AuthReg, AuthLog };
