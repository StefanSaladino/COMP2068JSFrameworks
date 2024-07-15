// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { ensureAuthenticated, isBanned } = require('../utilities/auth.js');

router.get('/', ensureAuthenticated, isBanned, (req, res) => {
    res.render('contact', { title: 'Contact Us' });
  });

// POST /contact
router.post('/', async (req, res) => {
    const { subject, message } = req.body;
    const userEmail = req.user.username; // Assumes req.user is populated with the logged-in user's info

    // Configure the SMTP transporter
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS, // Email is sent from the configured Outlook account
        replyTo: userEmail, // Replies will be directed to the user's email address
        to: process.env.EMAIL_ADDRESS,
        subject: subject,
        text: `Email from: ${userEmail}\n\nContent:\n${message}`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);
        // Send success message and redirect back to contact page
        req.flash('success', 'Email sent successfully!');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error sending email:', error);
        req.flash('error', 'Error sending email');
        res.redirect('/contact');
    }
});

module.exports = router;
