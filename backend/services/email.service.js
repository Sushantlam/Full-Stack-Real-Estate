const nodemailer = require("nodemailer");
const fs = require("fs"),
  path = require("path");
const Handlebars = require("handlebars");

const sourceMail = fs.readFileSync(path.join(__dirname, "templates", "general.hbs"), "utf8");
const mailTemplate = Handlebars.compile(sourceMail);
let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    auth: {
      user: 'sushantlama732@gmail.com',
      pass: 'aqfcukrkgcthhyqx',
    },
  });
  

const transferMail = async (options) => {
    const mailOptions = {
      from: "Real Estate <noreply@realestate.com>",
      to: options.email,
      subject: options.subject,
      html: mailTemplate({
        title: options.title,
        body: options.body,
        buttonLink: options.buttonLink,
        buttonText: options.buttonText,
      }),
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log("The email error is:", err);
    }
  }

  module.exports={transferMail}
  