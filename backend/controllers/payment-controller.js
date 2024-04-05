// This is your test secret API key.
import Stripe from 'stripe';
import { createOrder } from './order-controller.js';
const stripe = Stripe(process.env.STRIPE_TEST_KEY);;

const secret = process.env.JWT_SECRET || 'Tech4Dev';
let endpointSecret;
export const checkoutPayment = async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.body.userId,
                cart: JSON.stringify(req.body.cartItems)
            }
        });
        const line_items = req.body.cartItems.map(item => {
            return {
                price_data: {
                    currency: "NGN",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        description: item.description,
                        metadata: {
                            id: item.id
                        }
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.cartQuantity,
            }
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'NG'],
            },
            shipping_option: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'NGN',
                        },
                        display_name: 'Free Shipping',
                        //Delivers between 5-7 business days
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        }
                    }
                },
                {
                    shipping_rate_data: {
                        type: 'fixed amount',
                        fixed_amount: {
                            amount: 2000,
                            currency: 'NGN',
                        },
                        display_name: 'Next day air',
                        //Delivers in exactly 1 business day
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 1
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 1
                            },
                        }
                    }
                }
            ],
            phone_number_collection: {
                enabled: true,
            },
            customer: customer.id,
            line_items,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
        });

        res.send({ url: session.url });
    } catch (error) {
        console.log('Pyment error: ', error);
        res.status(500).json({ message: 'An error occurred during payment' });
    }
};

//stripe webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//endpointSecret = "whsec_4c933b56864bab4df876c587f121c78ebf35421502fef1fb2d1a31ab76292411";

export const webHook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    if (endpointSecret) {

        try {
            const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("Webhook verified");
            data = event.data.object;
            eventType = event.type;
        } catch (err) {
            console.log(`Webhook Error: ${err.message}`)
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
    else {
        data = req.body.data.object;
        eventType = req.body.type
    }

    // Handle the event
    if (eventType === 'checkout.session.completed') {
        stripe.customers
            .retrieve(data.customer)
            .then(() => {
                createOrder()
            })
            .catch((error) => console.log(error.message));
    }
    res.send().end();
}