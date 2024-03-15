const mailer = require('nodemailer');
//Create a transporter object using SMTP transport
let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adesinajesudunsin@gmail.com',
        pass: 'Dunsin23'
    }
});
//Define email options
let mailOptions = {
    from: 'adesinajesudunsin@gmail.com',
    to: 'feliciadesinac@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email sent from Nodemailer.'
};
//Send email
transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log('Error occurred: ', err);
    } else {
        console.log('Email sent', info.response);
    }
});