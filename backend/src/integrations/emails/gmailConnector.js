const BaseConnector = require("./baseConnector");
const nodemailer = require("nodemailer");
require("dotenv").config();

class GmailConnector extends BaseConnector {
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_GMAIL_HOST,
      auth: {
        user: process.env.MAIL_GMAIL_USER,
        pass: process.env.MAIL_GMAIL_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const mailOptions = {
        from: {
            name: process.env.MAIL_GMAIL_FROM_NAME,
            adress: process.env.MAIL_GMAIL_FROM_EMAIL
        },
        to: to,
        subject: subject,
        html: html,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Gmail error : ", error);
        } else {
          console.log("Email envoyé :", info.response);
        }
      });
    } catch (error) {
      console.error("Error with gmail provider : ", error);
    }
  }

  // async sendEmail({ to, subject, html }) {
  //     try {
  //       const infos = await this.transporter.sendMail({
  //         from: `${process.env.MAIL_BREVO_FROM_NAME} <${process.env.MAIL_BREVO_FROM_EMAIL}>`,
  //         to,
  //         subject,
  //         html,
  //       });
  //       return infos;
  //     } catch (error) {
  //       console.error("Error sending email:", error);
  //       throw new Error("Failed to send email");
  //     }
  //   }
}

module.exports = GmailConnector;
