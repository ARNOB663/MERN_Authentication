import dotenv from "dotenv";
import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });


    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`
    };
    await transporter.sendMail(mailOptions);
}