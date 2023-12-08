const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const mail = require("../config/mail");
const fs = require("fs").promises;
const path = require("path");
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
  const normalizedDirname = __dirname.replace(/\\/g, "/");
  const htmlTemplatePath = path.join(
    normalizedDirname,
    "..",
    "public",
    "email",
    "verifyEmail.html"
  );
  const htmlTemplate = await fs.readFile(htmlTemplatePath, "utf-8");

  const htmlContent = htmlTemplate
    .replace("${email}", email)
    .replace("${token}", token);

  let info = await mail.sendMail({
    from: '"Hi Bro!" <yudhitia@yudhitiarizki.my.id>',
    to: email,
    subject: "Verif Account for Aquamon.",
    text: "Please verify",
    html: htmlContent,
  });

  return info.messageId;
};

module.exports = { VerifyEmail, VerifToken, EmailToken };
