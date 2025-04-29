class BaseConnector {
  async sendEmail({ to, subject, html, text, transporter, sender }) {
    try {
      if (!html && !text) {
        throw new Error("Either HTML or text content must be provided !");
      }

      const mailOptions = {
        from: `"waria" <${sender}>`,
        to,
        subject,
      };

      if (html) {
        mailOptions.html = html;
      } else {
        mailOptions.text = text;
      }

      const info = await transporter.sendMail(mailOptions);

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
