import nodemailer from 'nodemailer';
import 'dotenv/config';
import { text } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token,email) =>{

    const emailTemplateSource = fs.readFileSync(path.join(__dirname,"template.hbs"),'utf-8');

    const template = Handlebars.compile(emailTemplateSource);

    const htmlToSend = template({token:token});

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
   html : htmlToSend,
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