// brevoConnector.js
const BaseConnector = require("./baseConnector");
const nodemailer = require("nodemailer");
require("dotenv").config();

class BrevoConnector extends BaseConnector {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_BREVO_HOST,
      port: process.env.MAIL_BREVO_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_BREVO_USER,
        pass: process.env.MAIL_BREVO_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Send email method
  async sendEmail({ to, subject, html, text }) {
    return super.sendEmail({
      to,
      subject,
      html,
      text,
      transporter: this.transporter,
      sender: process.env.MAIL_BREVO_SENDER,
    });
  }
}

module.exports = BrevoConnector;
