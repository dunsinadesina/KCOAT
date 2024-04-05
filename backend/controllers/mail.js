const mailer = require('nodemailer');
//Create a transporter object
const createMailTransporter = () => {
    const transporter = mailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'jesudunsinadesina@womentechsters.org',
            pass: 'Dunsin23',
        },
    });
    return transporter;
}
//function to send order confirmation email
const sendVerificationMail = (user) => {
    const transporter = createMailTransporter();

    const mailOptions = {
        from: '"KCOAT" <jesudunsinadesina@womentechsters.org>',
        to: user.email,
        subject: "Verify your Email",
        html: `<p>Hello 👋 ${user.cusName}, verify your email by clicking this link...</p>
    <a href='https://kcoat.onrender.com/verify-email?emailToken=${user.emailToken}'>Verify Your Email</a>`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Verification mail sent");
        }
    });
};

module.exports = { sendVerificationMail };