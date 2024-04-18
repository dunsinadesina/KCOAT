import nodemailer from 'nodemailer';

//Create a transporter object
const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
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
        from: '"KCOAT" <kcoatstyle@outlook.com>',
        to: user.email,
        subject: "Verify your Email",
        html: `<p>Hello 👋 ${user.cusName}, verify your email by clicking this link...</p>
    <a href='https://kcoat-project.onrender.com/verify-email?emailToken=${user.emailToken}'>Verify Your Email</a>`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Verification mail sent");
        }
    });
};

export const sendOrderConfirmationMail = async (customerEmail, orderId) => {
    try {
        const transporter = createMailTransporter();
        const mailOptions = {
            from: 'KCOAT <kcoatstyle@outlook.com>',
            to: customerEmail,
            subject: 'Order Confirmation',
            text: `Thank you for your order!😊 Your order with ID ${orderId} has been confirmed.`,
            html: `<p>Thank you for your order! Your order with ID ${orderId} has been confirmed.`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation mail has been sent: ', info.messageId);
    } catch (error) {
        console.log('Error in sending order confirmation email: ', error);
    }
}

export const sendPasswordResetMail = async (customerEmail, token) => {
    try {
        const transporter = createMailTransporter();
        const mailOptions = {
            from: 'KCOAT <kcoatstyle@outlook.com>',
            to: customerEmail,
            subject: 'Password Reset',
            html: `<p>Hello 👋 ${customerEmail}, reset your password by clicking this link...</p>
    <a href='https://kcoat.netlify.app/Reset?token=${token}'>Reset Your Password</a>`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Password reset mail has been sent: ', info.messageId);
    } catch (error) {
        console.log('Error in sending password reset mail: ', error);
    }
}