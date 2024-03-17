const Order = require('../model/orders');

const createOrder = async (customerId, Productid, quantity) => {
    try {
        const order = await Order.create({
            customer_id: customerId,
            product_id: Productid,
            quantity: quantity
        });
        console.log('Order created', order.toJSON());
    } catch (err) {
        console.log('Error in creating order:', err)
    }
}

module.exports = { createOrder };