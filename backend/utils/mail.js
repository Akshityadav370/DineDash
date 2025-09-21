import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendOtpMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: 'Reset Your Password',
    html: `<p>Your OTP for password for reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
