const nodemailer = require("nodemailer");
var express = require('express');
var router = express.Router();
var twilio = require('twilio');

router.post('/send', (req, res) => {

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        let data = req.body;

        let subject = data.subject;
        let html = data.html;
        let text = data.text;
        let to = data.to;

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'noreplykushisalon@gmail.com',
                pass: 'JOa0eO4Gtqn0'
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <noreplykushisalon@gmail.com>', // sender address
            to: to, // list of receivers
            subject: subject + " ✔", // Subject line
            text: text, // plain text body
            html: html // html body
        });
        res.send({message: info.messageId});
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);


});


router.post('/send/sms', (req, res) => {
    const accountSid = 'ACdacf6d583eb80b8c40c84f13dcfb489f';
    const authToken = '51223eb4c8409e5672c67022ba83aec5';
    const client = twilio(accountSid, authToken);

    const to = req.body.to;
    const msg = req.body.msg;

    client.messages
        .create({
            body: msg,
            from: '+18435364742',
            to: to
        })
        .then(message => res.status(200).send({success: true})
        ).catch(err => {
        res.status(500).send({success: false});
    });
});
module.exports = router;