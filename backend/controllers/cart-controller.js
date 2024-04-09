import { Op } from 'sequelize';
import { Cart, CartItem } from '../model/cart.js';
import { Order } from '../model/orders.js';
import { Product } from '../model/products.js';
import { purchaseProduct } from './product-controller.js';

export const addToCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;
    try {
        const [cart, created] = await Cart.findOrCreate({ where: { customerId } }); // Find or create the cart
        if (created) {
            console.log('New cart created for customer: ', customerId);
            res.status(201).json({ message: 'New cart created for customer' })
        } else {
            console.log('Cart already exists for customer: ', customerId);
            res.status(400).json({ message: 'Cart already exists for customer' });
        }
        console.log('Adding products to cart: ', productId, 'Quantity: ', quantity);
        await cart.addProducts(productId, { through: { quantity } }); // Use addProducts
        console.log('Product added to cart');
        await cart.save();
        console.log('Cart saved');
        return { success: true, message: 'Product has been successfully added to your shopping cart.' };
    } catch (err) {
        console.log('Error adding product to your shopping cart: ', err);
        return { success: false, message: 'Failed to add product to your shopping cart' };
    }
};

export const checkOut = async (customerId) => {
    try {
        let cart = await Cart.findOne({ where: { customerId }, include: [{ model: Product }] }); // Include associated products
        let order = await Order.create({ customerId });
        for (let item of cart.Products) {
            await order.addProduct(item.id, { through: { quantity: item.CartItem.quantity } }); // Access quantity through CartItem
            await purchaseProduct(item.id);
        }
        await cart.removeProducts(cart.Products); // Use removeProducts
        return { success: true, message: 'Checkout successful' };
    } catch (err) {
        console.log('Error checking out: ', err);
        return { success: false, message: 'Failed to checkout' };
    }
};

export const retrieveCart = async (req, res) => {
    try {
        const customerId = req.query.customerId;
        const cart = await Cart.findOne({ where: { customerId } });
        if (cart) {
            const cartItems = await CartItem.findAll({ where: { cartId: cart.id }, include: {model: Product} });
            res.status(200).json({ message: 'Successfully retrieved cart', cartItems });
        } else {
            res.status(404).json({ message: "No cart found for this user" })
        }
    } catch (err) {
        console.log('Error retrieving cart: ', err);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const cleanUpOldCarts = async () => {
    try {
        //time limit for cart expiry(a week)
        const expiryTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        //find carts that were last updated before expiry time
        const oldCarts = await Cart.findAll({
            where: {
                updatedAt: {
                    [Op.lt]: expiryTime
                }
            }
        });
        //remove old carts from database
        await Promise.all(oldCarts.map(cart => cast.destroy()));
        console.log(`Cleanup complete: Removed ${oldCarts.length} old carts.`);
    } catch (err) {
        console.log('Error cleaning up old carts: ', err)
    }
}