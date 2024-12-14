import "server-only";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.ADMIN_EMAIL_HOST,
  port: process.env.ADMIN_EMAIL_PORT,
  secure: true, // true for port 465, false for other ports 587
  auth: {
    user: process.env.ADMIN_EMAIL_USER,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

export default transporter;