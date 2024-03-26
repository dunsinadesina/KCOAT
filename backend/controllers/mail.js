const mailer = require('nodemailer');
//Create a transporter object using SMTP transport
let transporter = mailer.createTransport({
    service: 'smtp.kcoat.com',
    port:587,
    secure:false,
    auth: {
        user: 'adesinajesudunsin@gmail.com',
        pass: 'Dunsin23'
    }
});
//function to send order confirmation email
const sendOrderConfirmationMail = async (customerEmail, orderDetails) => {
    const emailTemplate = generateOrderConfirmationTemplate(orderDetails);
    try {
        await transporter.sendMail({
            from: 'adesinajesudunsin@gmail.com',
            to: customerEmail,
            subject: 'Order Confirmation',
            html: emailTemplate
        });
        console.log('Order confirmation mail sent successfully');
    } catch (error) {
        console.log('Error sending order confirmation mail : ', error);
    }
}

module.exports = { sendOrderConfirmationMail };