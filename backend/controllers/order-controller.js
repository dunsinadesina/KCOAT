import { Customer } from '../model/customer.js';
import { Order } from '../model/orders.js';
import { Product } from '../model/products.js';
//const e = require('express');

export const convertCartToOrder = async (req, res) => {
    try {
        const { customerId } = req.body;
        const customer = await Customer.findByPk(customerId);  //get the logged in user info from session
        if (!customer) return res.status(401).json({ error: 'You must be logged in to do this.' });   //if no user is found with that id then return an error
        //find the items in cart
        const cartItems = await customer.getCartItems();
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.quantity * item.price;
        });
        //create order
        const order = await Order.create({
            customerId: customer.id,
            totalPrice: totalPrice,
            status: 'ordered'
        });
        //add products to order
        for (const item of cartItems) {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            await order.addProduct(product, { through: { quantity: item.quantity } });
        }
        await customer.removeCartItems(cartItems);
        return res.status(201).json({ success: true, message: 'Cart converted to order successfully', order });
    } catch (err) {
        console.log('Error converting cart to order', err);
        return res.status(500).json({ success: false, message: 'Failed to convert to order', error: err.details });
    }
}

export const createOrder = async (req, res) => {
    try {
        const { customerId, products } = req.body;
        if (!customerId) {
            return res.status(400).json({ message: 'Please provide the customer ID' })
        }
        const customer = await Customer.findByPk(req.body.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' })
        }
        //validate products
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(402).json({ message: 'Please provide at least one product with quantity' });
        }
        let totalQuantity = 0;
        for (const product of products) {
            totalQuantity += product.quantity;
        }
        // Create the order
        const order = await Order.create({ customerId, quantity: totalQuantity });
        //add products to the order
        for (const product of products) {
            const productInstance = await Product.findByPk(product.Productid);
            if (!productInstance) {
                return res.status(403).json({ message: `Product with ID ${product.Productid} not found` });
            }
            // Ensure that product.quantity is set
            if (!product.quantity) {
                return res.status(405).json({ message: 'Please provide quantity for each product' });
            }
            await order.addProduct(productInstance, { through: { quantity: product.quantity } });
        }
        return res.status(200).json({ message: 'Product has been successfully added to your shopping cart.', order });
    } catch (err) {
        console.error('Error in creating order:', err);
        return res.status(401).json({ message: 'Failed to add product to your shopping cart', error: err });
    }
};

export const viewOrders = async (req, res) => {
    try {
        const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'DESC', customerid, productid, status } = req.query;
        filter = {};
        if (customerid) {
            filter.customerId = customerid;
        }
        if (productid) {
            filter.productId = productid;
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
        const orders = await OrderProduct.findAll(options);
        const totalCount = await OrderProduct.count({ where: filter });//for pagination
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

export const viewParticularOrder = async (req, res) => {
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

export const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { quantity, status } = req.body;
        //validate request payload
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

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order is already canceled or does not exist." });
        }
        order.status = 'cancelled';
        await order.save();
        res.status(200).send("Order has been successfully cancelled.");
    } catch (err) {
        console.log('Error in cancelling order: ', err);
        res.status(500).json({ message: 'Failed to cancel the order.' });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Invalid Status' });
        }
        order.status = status;
        await ordersave();
        res.status(200).json({ message: 'Order Status updated succesfully' });
    } catch (err) {
        console.log('Error updating order status: ', err);
        res.status(500).json({ message: "Failed to update order status" });
    }
}

export const calcOrderTotal = async function () {
    let totalPrice = 0;

    try {
        // Fetch products associated with the order
        const products = await this.getProducts();

        // Calculate total price
        products.forEach(product => {
            totalPrice += product.price * this.quantity;
        });

        this.totalPrice = totalPrice;

        // Save the updated order instance to the database
        await this.save();

        return this.totalPrice;
    } catch (error) {
        console.error('Error calculating order total:', error);
        throw new Error('Error calculating order total');
    }
};
