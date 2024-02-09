const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const mail = require("../config/mail");
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config();

const VerifToken = async (req, res) => {
  try {
    const { token } = req.body;
    jwt.verify(token, process.env.VERIF_TOKEN_SECRET, async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .send({ message: "Failed to verify! Please try again!" });

      const verifCount = await Users.update(
        { verified: true },
        {
          where: {
            email: decoded.email,
          },
        }
      );

      if (verifCount < 1) {
        return res.status(400).json({
          message: "Users not yet verify! please try again later",
        });
      }

      return res.status(200).json({
        message: "Verify Success!",
      });
    });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({
      message: "Failed to verify!",
    });
  }
};

const EmailToken = (email) => {
  const token = jwt.sign({ email }, process.env.VERIF_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

const VerifyEmail = async (email, token) => {
  mail.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        partialsDir: "src/templates/email",
        layoutsDir: "src/templates/email",
        defaultLayout: "email-verification.hbs",
      },
      viewPath: "src/templates/email",
      extName: ".hbs",
    })
  );

  let info = await mail.sendMail({
    from: '"Email Verification" <no-reply@aquamon.my.id>',
    to: email,
    subject: "Verify Account Aquamon",
    template: "email-verification",
    context: {
      link: `${process.env.BASE_URL}#/verify/${token}`,
    },
  });

  return info.messageId;
};

module.exports = { VerifyEmail, VerifToken, EmailToken };
