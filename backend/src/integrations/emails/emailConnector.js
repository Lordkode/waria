const BrevoConnector = require("../emails/brevoConnector");
const MailjetConnector = require("../emails/mailjetConnector");

class EmailConnector {
  constructor() {
    this.connectors = [
      new BrevoConnector(),
      new MailjetConnector(),
    ];
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

    const errors = [];

    for (const connector of this.connectors) {
      try {
        const result = await connector.sendEmail({ to, subject, html });
        console.log(`Email envoyé avec ${connector.constructor.name}`);
        return result;
      } catch (error) {
        console.warn(
          `Error with ${connector.constructor.name} :`,
          error.message
        );
        errors.push({
          connector: connector.constructor.name,
          error: error.message,
        });
      }
    }

    throw new Error(`Cann't send email. Details : ${JSON.stringify(errors)}`);
  }
}

module.exports = EmailConnector;
