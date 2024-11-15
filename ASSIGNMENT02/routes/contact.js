// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { ensureAuthenticated, isBanned } = require('../utilities/auth.js');

router.get('/', ensureAuthenticated, isBanned, (req, res) => {
    res.render('contact', { title: 'Contact Us', isAdmin: req.user && req.user.role === 'admin' });
  });

  router.post('/', ensureAuthenticated, async (req, res) => {
    const { email, subject, message } = req.body;

    // Configure the SMTP transporter
    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options for sending to support
    let mailOptionsToSupport = {
        from: process.env.EMAIL_ADDRESS, // Email is sent from the configured Outlook account
        replyTo: email, // Replies will be directed to the user's provided email address
        to: process.env.EMAIL_ADDRESS,
        subject: subject,
        text: `Email from: ${email}\n\nContent:\n${message}`
    };

    // Email options for auto-response
    let mailOptionsToUser = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Thanks for reaching out!',
        text: 'Thank you for your query, someone will answer you within the hour.'
    };

    try {
        // Send email to support
        await transporter.sendMail(mailOptionsToSupport);

        // Send auto-response email to the user
        await transporter.sendMail(mailOptionsToUser);

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