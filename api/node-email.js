"use strict";
        //call the env document
        require("dotenv").config();
        //call nodemailer
        const nodemailer = require("nodemailer");
        const path = require("path");

        const sendEmail = async (mailObj) => {
            const {from, recipients, subject, message} = mailObj;

            try{
                //creating a transport object with all the required details of the message service provider and user access to that.
                let transporter = nodemailer.createTransport({
                    host:"smtp-relay.sendinblue.com",
                    port: 587,
                    auth:{
                        user:process.env.USER,
                        pass:process.env.PASS,
                    },
                });
                //Enter all the details to mail.
                let mailStatus = await transporter.sendMail({
                    from:from,
                    to:recipients,
                    subject:subject,
                    text:message,

                    //send the email in the html format
                    html:{
                        path: path.resolve(__dirname,"../Front-end part/index.html"),
                    }
                });

                console.log(`Message sent: ${mailStatus.messageId}`);

                return `Message sent: ${mailStatus.messageId}`; 
            }catch(error){
                console.error(error);
                
            };
        }
        const mailObj = {
            from: "daviestevam02@gmail.com",
            recipients: ["daviestevam02@gmail.com"],
            subject: "Davi",
            message: "messageEmail",
            };
            
            sendEmail(mailObj).then((res) => {
            console.log(res);
            });

            module.exports = sendEmail;