const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",            // or "Outlook", "Yahoo", or SMTP settings
    auth: {
      user: process.env.EMAIL,   // sender email
      pass: process.env.EMAIL_PASS  // app password or SMTP password
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
