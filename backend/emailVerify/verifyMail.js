import nodemailer from 'nodemailer';
import 'dotenv/config';
import { text } from 'express';

export const verifyMail = async (token,email) =>{
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const mailConfigurations={
    form : process.env.MAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: "<h1>hey this is testing mail"
}
transporter.sendMail(mailConfigurations,(error,info)=>{
    if(error){
        throw new Error(error)
    }else{
        console.log('Email sent successfully: ' + info.response);
    }
}
)
}