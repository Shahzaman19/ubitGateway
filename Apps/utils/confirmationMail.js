/* eslint-disable no-undef */
const nodemailer = require('nodemailer')
const {User } = require('../model/user')

 // Send a confirmation email to the user
 const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });
  async function confirmEmail() {
    const user = await User.find()
  const mailOptions = {
    to : user[0].email,
    subject: 'Your password has been changed',
    text: `Hi ${user[0].name},\n\n`
      + `This is a confirmation that the password for your account ${user[0].email} has just been changed.\n`
  };

  await transporter.sendMail(mailOptions);


  }

module.exports = {confirmEmail};