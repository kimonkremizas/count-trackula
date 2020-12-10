// Nodemailer
require('dotenv').config();
const nodemailer = require('nodemailer');


// Step 1

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
    // user: 'real.count.trackula@gmail.com',
    // pass: 'Zealand2020'
  }
});

// Step 2
let mailOptions ={
  from: 'real.count.trackula@gmail.com',
  to: 'k.kremizas@gmail.com',
  subject: 'Test subject',
  text: 'Test text'
};

// Step 3


export function sendEmail(){
transporter.sendMail(mailOptions, function(err, data){
  if (err) {
    console.log('Errror occurs', err);
  }
  else{
    console.log('Email sent!!!')
  }
});
}