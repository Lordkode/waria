const BravoConnector = require("../emails/brevoConnector");
//const Mailgunconnector = require("../emails/mailgunConnector");

class EmailConnector {
  constructor() {
    this.brevo = new BravoConnector();
    //this.mailgun = new Mailgunconnector();
  }

  async sendVerificationEmail({ to, verificationCode }) {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Vérifiez votre adresse e-mail</h2>
      <p>Merci de vous être inscrit !</p>
      <p>Voici votre code de vérification :</p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #2d89ef;">
        ${verificationCode}
      </div>
      <p>Ce code expirera dans quelques minutes.</p>
      <p style="margin-top: 30px;">À bientôt,<br>L'équipe de Ton App</p>
    </div>
  `;

    const subject = "Vérifiez votre adresse e-mail";

    let result = await this.brevo.sendEmail({
      to,
      subject,
      html,
      text: `Merci de vous être inscrit ! Voici votre code de vérification : ${verificationCode}. Ce code expirera dans quelques minutes.`,
      transporter: this.brevo.transporter,
      sender: process.env.MAIL_BREVO_SENDER,
    });

    return result;
  }
}

module.exports = EmailConnector;
