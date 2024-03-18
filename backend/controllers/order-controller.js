const { Order } = require('../model/orders');

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

const viewOrders = async (req, res) => {
    try {
        const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC', customerId, Productid, status } = req.query;
        filter = {};
        if (customerId) {
            filter.customerId = customerId;
        }
        if (Productid) {
            filter.productId = Productid;
        }
        if (status) {
            filter.status = status;
        }
        const options = {
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder]],
            where: filter
        };
        const orders = await Order.findAll(options);
        const totalCount = await Order.count({ where: filter });//for pagination
        const response = {
            orders,
            totalCount
        };
        //send response
        res.status(200).json(response);
    } catch (err) {
        console.log('Error fetching orders', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const viewParticularOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order Not Found' });
        }
        res.status(200).json(order);
    } catch (err) {
        console.log('Error viewing order: ', err);
        res.status(504).json({ message: 'Server Error' });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { quantity, status } = req.body;
        //validate req payload
        if (!quantity || !status) {
            return res.status(400).json({ message: 'Missing fields!' });
        }
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }
        order.quantity = quantity;
        order.status = status;
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        console.log('Error in updating order: ', err);
        res.status(500).json({ message: "Failed to Update Order" });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order is already canceled or does not exist." });
        }
        order.status = 'cancelled';
        await order.save();
        res.status(200).send("Order has been successfully Cancelled.");
    } catch (err) {
        console.log('Error in cancelling order: ', err);
        res.status(500).json({ message: 'Failed to Cancel the Order.' });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = re.body;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Invalid Status' });
        }
        order.status = status;
        await ordersave();
        res.status(200).json({ message: 'Order Status updated succesfully' });
    } catch (err) {
        console.log('Error updating order status: ', err);
        res.status(500).json({ message: "Faild to update order status" });
    }
}
module.exports = { createOrder, viewOrders, viewParticularOrder, updateOrder, cancelOrder, updateOrderStatus };