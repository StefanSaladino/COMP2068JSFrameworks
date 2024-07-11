const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Configure the email transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS 
  }
});

/**
 * Send a verification email to the user.
 * 
 * @param {string} userEmail - The user's email address (which is also their username).
 * @param {string} userId - The user's unique ID, generated by MongoDB
 */
function sendVerificationEmail(userEmail, userId) {
  // Create a JWT token with the user's ID, valid for 10 minutes
  const token = jwt.sign({ id: userId }, 'ourSecretKey', { expiresIn: '10m' });

  // Email configuration
  const mailConfigurations = {
    from: process.env.EMAIL_ADDRESS,
    to: userEmail, // Send to the user's email address
    subject: 'Email Verification',
    text: `Hi! Please follow the link to verify your email: https://placefinder.onrender.com/verify/${token} Thanks`
  };

  // Send the email
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) {
      console.error('Error sending email:', error); // Log any error that occurs
      throw new Error(error); // Throw an error to indicate failure
    }
    console.log('Email Sent Successfully'); // Log success
    console.log(info); // Log additional info about the sent email
  });
}

module.exports = { sendVerificationEmail };
