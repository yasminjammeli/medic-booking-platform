const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports.sendAppointmentEmail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: `"Medic Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log("✅ Email sent to", to);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
};
