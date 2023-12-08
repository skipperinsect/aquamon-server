const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require("dotenv").config();

const AuthToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const [tokenType, tokenValue] = authHeader.split(" ");

    if (tokenType !== "Bearer") {
      return res.status(403).send({
        message: "An error occurred in the forwarded Authorization",
      });
    }

    if (tokenValue == null) {
      return res.status(401).send({
        message: "An error occurred in the forwarded Authorization",
      });
    }

    jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      data_user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    });
  } catch (err) {
    return res.status(403).send({
      message: "This feature requires login.",
    });
  }
};

const AuthAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const [tokenType, tokenValue] = authHeader.split(" ");

    if (tokenType !== "Bearer") {
      return res.status(403).send({
        message: "An error occurred in the forwarded Authorization",
      });
    }

    if (tokenValue == null) {
      return res.status(401).send({
        message: "An error occurred in the forwarded Authorization",
      });
    }

    jwt.verify(
      tokenValue,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const user = await Users.findOne({
          where: {
            email: decoded.email,
          },
        });
        if (user.role !== 1) {
          return res.status(400).json({
            message: "You cant access this feature",
          });
        }
        data_user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        next();
      }
    );
  } catch (err) {
    return res.status(403).send({
      message: "This feature requires login.",
    });
  }
};

const AuthLog = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email: email,
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
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  };

  next();
};

module.exports = {
  AuthToken,
  AuthAdmin,
  AuthLog,
};
