class BaseConnector {
  async sendEmail({ to, subject, html, text, transporter, sender }) {
    try {
      const info = await transporter.sendEmail({
        from: `"waria" <${sender}>`,
        to,
        subject,
        html,
        text,
      });

      return { success: true, message: "Email sent successfully", data: info };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send email",
        error: error.message,
      };
    }
  }
}

module.exports = BaseConnector;
