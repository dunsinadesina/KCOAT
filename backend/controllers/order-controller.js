import { Product } from '../model/products.js';

// Function to decrement product Quantity when ordered
export const orderProduct = async (req, res) => {
    const { Productid, Quantity } = req.body;

    try {
        const product = await Product.findByPk(Productid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.Quantity < Quantity) {
            return res.status(400).json({ message: 'Insufficient Quantity available' });
        }
        await product.decrement('Quantity', { by: Quantity });
        res.status(200).json({ message: 'Product ordered successfully' });
    } catch (error) {
        console.error('Error ordering product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Function to increment product Quantity when restocked
export const restockProduct = async (req, res) => {
    const { Productid, Quantity } = req.body;

    try {
        const product = await Product.findByPk(Productid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.increment('Quantity', { by: Quantity });
        res.status(200).json({ message: 'Product restocked successfully' });
    } catch (error) {
        console.error('Error restocking product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
