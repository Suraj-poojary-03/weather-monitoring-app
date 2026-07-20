const nodemailer = require("nodemailer");

const mailID = process.env.MAIL_ID;
const appPass = process.env.APP_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailID,
    pass: appPass,
  },
});

module.exports = transporter;
