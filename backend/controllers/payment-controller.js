// This is your test secret API key.
import Stripe from 'stripe';
import { sendOrderConfirmationMail } from './mail.js';
export const stripe = Stripe('sk_test_51P1c0BRsLNFrfbLCMKUHvJcayKbcYSnFsFskOjkHmQvEQrhLIyzfdTKvzwIsPAuh1ortsZQ94PAY91Riko6irUoT00Dpdx7Don');

// Function to update or create a Stripe customer
const updateOrCreateStripeCustomer = async (email, userId, cartItems) => {
    const existingStripeCustomer = await stripe.customers.list({
        email: email,
        limit: 1,
    });

    if (existingStripeCustomer.data.length > 0) {
        const stripeCustomerId = existingStripeCustomer.data[0].id;
        await stripe.customers.update(stripeCustomerId, {
            metadata: {
                userId: userId,
                cartItemCount: cartItems.length.toString(),
            }
        });
        return stripeCustomerId;
    } else {
        const newStripeCustomer = await stripe.customers.create({
            email: email,
            metadata: {
                userId: userId,
                cartItemCount: cartItems.length.toString()
            }
        });
        return newStripeCustomer.id;
    }
};

export const checkoutPayment = async (req, res) => {
    try {
        const { email, cartItems } = req.body;
        // Ensure that req.body.cartItems is defined and is an array
        if (!req.body.cartItems || !Array.isArray(req.body.cartItems)) {
            throw new Error('Invalid cart items');
        }
        const totalAmount = cartItems.reduce((acc, Product) => {
            // Extract numerical value from the price string and convert it to a number
            const price = parseFloat(Product.productPrice.replace('N', ''));
            if (isNaN(price) || isNaN(Product.quantity)) {
                throw new Error('Invalid price or quantity');
            }
            return acc + (price * Product.quantity);
        }, 0);

        // Update or create a customer
        const stripeCustomerId = await updateOrCreateStripeCustomer(email, req.body.userId, cartItems);

        const line_items = req.body.cartItems.map(Product => ({
            price_data: {
                currency: "NGN",
                product_data: {
                    name: Product.productName,
                    images: [Product.productImage],
                    //ProductDescription: Product.ProductDescription,
                    metadata: {
                        productId: Product.id,
                    },
                },
                unit_amount: Math.round(parseFloat(Product.productPrice.replace('N', '')) * 100),
            },
            quantity: Product.quantity,
        }));
        //Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'NG'],
            },
            line_items,
            mode: 'payment',
            success_url: 'https://kcoat.netlify.app/payment-success',
            cancel_url: 'https://kcoat.netlify.app/checkout',
            metadata: {
                user: stripeCustomerId,
            }
        });
        // const customerId = session.metadata.customerId;

        //Store payment information in the database
        // await Payment.create({
        //     customerId: customerId,
        //     amount: totalAmount,
        //     status: 'ordered',
        //     deliveryAddress: req.body.deliveryAddress,
        //     deliveryDate: req.body.deliveryDate
        // });


        res.send({ url: session.url });
        console.log('Recipient email:', email);
        await sendOrderConfirmationMail(email, cartItems);

    } catch (error) {
        console.log('Payment error: ', error);
        res.status(500).json({ message: 'An error occurred during payment', error });
    }
};

//stripe webhook
export const webHook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, secret);
        console.log('Webhook Verified');
        data = event.data.object;
        eventType = event.type;
        //Handle the event
        switch (eventType) {
            case 'checkout.session.completed':
                //Retrieve customer information and create an order
                const customer = await stripe.customers.retrieve(data.customer);
                console.log('Customer retrieved: ', customer)
                await createOrder(data);
                await updateOrderStatus(data.id, 'success');
                break;
            case 'checkout.session.failed':
                await updateOrderStatus(data.id, 'failed');
                break;
            default:
                console.log(`Unhandled event type ${eventType}`);
        }
        res.status(200).json({ message: 'Webhook retrieved and processed successfully' });
    } catch (error) {
        console.log(`Webhook Error: ${error.message}`);
        res.status(500).json({ message: `Webhook Error: ${error.message}` });
    }
}