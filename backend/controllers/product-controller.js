import FormData from 'form-data';
import multer from 'multer';
import fetch from 'node-fetch';
import { Op } from 'sequelize';
import { sequelize } from '../config/connection.js';
import { Product } from '../model/products.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('ProductImage');

const uploadToImgur = async (filePath) => {
    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(filePath));
        const imgurRes = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: '3627df7ef3b2b5d'
            },
            body: formData
        });
        const imgurData = await imgurRes.json();
        return imgurData.data.link;
    } catch (error) {
        console.log('Error uploading image to imgur', error);
        throw new Error('Error uploading image to imgur');
    }
}

//Define the function to insert new Product
export const insertProduct = async (req, res) => {
    upload(req, res, async function (error) {
        if (error instanceof multer.MulterError) {
            return res.status(500).json({ error: 'File upload error' });
        } else if (error) {
            return res.status(500).json({ error: error.message })
        }
    })
    const { ProductName, ProductPrice, ProductDescription, ProductCategory, SubCategory, ProductImage, ProductSize, Quantity } = req.body;

    try {
        if (!ProductName || !ProductPrice || !ProductDescription || !ProductCategory || !SubCategory || !Quantity) {
            return res.status(400).json({ message: "Fill in all fields" });
        }
        const existingProduct = await Product.findOne({ where: { ProductName } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with the same name already exists' });
        }
        //Create new product record using the product model
        const newProduct = await Product.create({
            ProductName,
            ProductPrice,
            ProductDescription,
            ProductCategory,
            SubCategory,
            ProductImage: null,
            Quantity,
            ProductSize
        });
        console.log("New product created");
        res.status(201).json({ message: 'New Product created', result: newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', error })
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
        const ProductId = req.params.Productid;
        const updatedProductData = {
            ProductName: req.body.ProductName,
            ProductPrice: req.body.ProductPrice,
            ProductDescription: req.body.ProductDescription,
            ProductCategory: req.body.ProductCategory,
            ProductImage: req.body.ProductImage,
            SubCategory: req.body.SubCategory,
            ProducyCategory: req.body.ProductCategory,
            Quantity: req.body.Quantity
        }
        try {
            const product = await Product.findByPk(ProductId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found...' });
            }
            await product.update(updatedProductData);
            res.status(200).json(product);
        } catch (err) {
            console.error("Error updating product", err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    //function to delete an existing product by its ID
    export const deleteProduct = async (req, res) => {
        const ProductId = req.params.Productid;
        try {
            const product = await Product.findByPk(ProductId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            await product.destroy();
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            console.log('Error occurred while deleting product', err)
            res.status(500).json({ error: 'Internal Server Error' });
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