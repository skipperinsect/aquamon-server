const { Users } = require("../models");
const { authorizationUrl, oauth2Client, google } = require("../config/google");

const { VerifyEmail, EmailToken } = require("./VerifyEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Register = async (req, res) => {
  const user = data_user;

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(user.password, salt);

  try {
    await Users.create({
      name: user.name,
      email: user.email,
      password: hashPassword,
      role: 0,
      verified: false,
    });

    const token = EmailToken(user.email);

    VerifyEmail(user.email, token);

    res.json({
      message: "Register Successfully, Check your email to verify!",
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to Register",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { id, name, email, role } = data_user;

    const accessToken = jwt.sign(
      {
        id,
        name,
        email,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3d",
      }
    );

    const expiresIn = 3 * 24 * 60 * 60 * 1000;
    const expiredDate = new Date(Date.now() + expiresIn);

    const refreshToken = jwt.sign(
      {
        id,
        name,
        email,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Users.update(
      {
        refreshToken: refreshToken,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      id,
      name,
      email,
      role,
      accessToken,
      expiresIn: expiredDate.getTime(),
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Gagal Login",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    var user = await Users.findAll({
      where: {
        isVerified: 0,
      },
    });

    return res.json({
      data: user,
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to Fetch User",
    });
  }
};

const authGoogle = (req, res) => {
  res.redirect(authorizationUrl);
};

const callbackGoogle = async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oath2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oath2.userinfo.get();

  const user = await Users.findOne({
    where: {
      email: data.email,
    },
  });

  return res.json({ user, data });
};

module.exports = {
  Register,
  Login,
  getUsers,
  authGoogle,
  callbackGoogle,
};
