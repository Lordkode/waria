const BaseConnector = require("./baseConnector");
const nodemailer = require("nodemailer");
require("dotenv").config();

class MailjetConnector extends BaseConnector {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_MAILJET_HOST,
      port: process.env.MAIL_MAILJET_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_MAILJET_USER,
        pass: process.env.MAIL_MAILJET_PASSWORD,
      },
    });
    this.sender = process.env.MAIL_MAILJET_FROM_EMAIL;
  }

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

module.exports = MailjetConnector;
