import { Op } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { Product } from '../model/products.js';
import cloudinaryV2 from './cloudinary.js';

//Define the function to insert new Product
export const insertProduct = async (req, res) => {
    try {
        const { ProductName, ProductPrice, ProductDescription, ProductCategory, SubCategory, Quantity } = req.body;
        const ProductImage = req.file;
        // Check if all required fields are provided
        if (!ProductName || !ProductPrice || !ProductDescription || !ProductCategory || !SubCategory || !Quantity) {
            return res.status(400).json({ message: "Fill in all fields" });
        }

        // Upload image to Cloudinary
        if (ProductImage) {
            const uploadResponse = await cloudinaryV2.uploader.upload(ProductImage.path, {
                upload_preset: 'kcoatstyle',
                folder: 'products'
            });
            if (uploadResponse) {
                const product = new Product({
                    ProductName,
                    ProductPrice,
                    ProductDescription,
                    ProductCategory,
                    SubCategory,
                    Quantity,
                    ProductImage: uploadResponse.secure_url
                })
                const savedProduct = await product.save();
                res.status(200).send(savedProduct);
            }
        }
    } catch (error) {
        console.log("Error in creating product: ", error);
        res.status(500).send(error);
    }
}

//function to get all products from database
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ include: Product.ProductCategory });
        res.status(200).json(products);
    } catch (err) {
        console.log('Error in retrieving products: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//function to get a product by its ID
export const getProductById = async (req, res) => {
    const productid = req.params.Productid;
    try {
        const product = await Product.findByPk(productid, { include: Product.ProductCategory });
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.log('Error retrieving product by ID:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//function to get product by category
export const getProductByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.findAll({ where: { ProductCategory: category } });
        return res.status(200).json(products);
    } catch (error) {
        console.log('Error in retrieving products by id: ', error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//function to get product by subcategory
export const getProductBySubCategory = async (req, res) => {
    const { category, subcategory } = req.params;
    try {
        const products = await Product.findAll({
            where: {
                ProductCategory: category,
                SubCategory: subcategory
            }
        });
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error getting products by Sub Category: ", error);
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

//function to update an existing product by its ID
export const updateProductById = async (req, res) => {
    const Productid = parseInt(req.params.Productid);
    const { ProductName, Quantity, ProductCategory, SubCategory, ProductPrice, imageUrl, ProductDescription } = req.body;

    try {
        const product = await Product.findByPk(Productid);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product fields
        product.ProductName = ProductName;
        product.Quantity = Quantity;
        product.ProductCategory = ProductCategory;
        product.SubCategory = SubCategory;
        product.ProductPrice = ProductPrice;
        product.imageUrl = imageUrl;
        product.ProductDescription = ProductDescription;

        // Save the updated product to the database
        await product.save();

        return res.json({ message: 'Product updated successfully', updatedProduct: product });
    } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: 'Error occurred while updating product' });
    }
}
//function to delete an existing product by its ID
export const deleteProduct = async (req, res) => {
    const ProductId = req.params.Productid;
    try {
        const product = await Product.findByPk(ProductId);
        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log('Error occurred while deleting product', err)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const purchaseProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity <= 0) {
            return res.status(400).json({ message: 'Product out of stock' });
        }
        //Decrement quantity
        product.quantity -= 1;
        await product.save();
        return res.status(200).json({ message: 'Product purchased successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
}

export const getMostPopularProducts = async (req, res) => {
    try {
        const popularProducts = await sequelize.query(
            `SELECT p.Productid, p.ProductName, SUM(o.quantity) AS totalQuantitySold
            FROM Products p
            JOIN Orders o ON p.Productid = o.Productid
            GROUP BY p.Productid, p.ProductName
            ORDER BY totalQuantitySold DESC
            LIMIT 4;
            `, { type: sequelize.QueryTypes.SELECT });
        return res.json(popularProducts);
    } catch (error) {
        console.log('Error in fetching popular products: ', error);
        throw error;
    }
}

export const getNewAndFeaturedProducts = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newProducts = await Product.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } }
        });
        res.status(200).json({ message: newProducts });
    } catch (error) {
        console.log('Error in fetching products: ', error);
        res.status(500).json({ message: 'Error in fetching products' });
    }
}