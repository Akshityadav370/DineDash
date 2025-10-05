import dotenv from 'dotenv';
import { transporter } from '../index.js';
dotenv.config();

export const sendOtpMail = async (to, otp, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    html: `<p>Your OTP for ${html} is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
