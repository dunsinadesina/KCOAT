import { Op } from 'sequelize';
import { Cart, CartItem } from '../model/cart.js';
import { Order } from '../model/orders.js';
import { Product } from '../model/products.js';
import { purchaseProduct } from './product-controller.js';

export const addToCart = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' })
        }
        const newCartItem = await CartItem.create({
            productId: product.Productid,
            ProductName: product.ProductName,
            ProductPrice: product.ProductPrice,
            quantity: 1, //default
            ProductImage: product.ProductImage
        })
        return res.status(200).json({ message: 'Product added to cart', newCartItem });
    } catch (error) {
        console.log('Error adding product to cart:', error);
        return res.status(500).json({ message: 'Internal server error' });
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
            const cartItems = await CartItem.findAll({ where: { cartId: cart.id }, include: { model: Product } });
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