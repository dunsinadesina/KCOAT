import mailer from 'nodemailer';
//Create a transporter object
const createMailTransporter = () => {
    const transporter = mailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'kcoatstyle@outlook.com',
            pass: 'kcoatkcoat12',
        },
    });
    return transporter;
}
//function to send order confirmation email
export const sendVerificationMail = (user) => {
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