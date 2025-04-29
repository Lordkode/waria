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
        pass: process.env.MAIL_BREVO_PASSWORD,
      },
    });
    this.sender = process.env.MAIL_BREVO_FROM_EMAIL;
  }

  // Send email method
  async sendEmail({ to, subject, html }) {
    return super.sendEmail({
      to,
      subject,
      html,
      transporter: this.transporter,
      sender: this.sender,
    });
  }
}

module.exports = BrevoConnector;
