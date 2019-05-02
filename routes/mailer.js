const nodemailer = require("nodemailer");
var express = require('express');
var router = express.Router();

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

module.exports = router;