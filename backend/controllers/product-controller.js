const { Product } = require('../model/products');
//Define the function to insert new Product
const insertProduct = (req, res) => {
    const productData = {
        //Extract product data from the request body
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductDescription: req.body.ProductDescription,
        ProductCategory: req.body.ProductCategory,
        ProductImage: req.body.ProductImage
    };
    //Create new product record using the customer model
    Product.create(productData).then(result => {
        console.log(result);
        res.status(201).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' })
    })
}
//function to get all products from database
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        console.log('Error in retrieving products: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//function to get a product by its ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(Product.Productid);
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
//function to update an existing product by its ID
const updateProductById = async (req, res) => {
    const ProductId = req.params.Productid;
    const updatedProductData = {
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductDescription: req.body.ProductDescription,
        ProductCategory: req.body.ProductCategory,
        ProductImage: req.body.ProductImage
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
const deleteProduct = async (req, res) => {
    //const ProductId = req.params.Productid;
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
//Export modules
module.exports = { insertProduct, getAllProducts, getProductById, updateProductById, deleteProduct };