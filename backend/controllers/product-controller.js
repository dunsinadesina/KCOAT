import { Product } from '../model/products.js';
//Define the function to insert new Product
export const insertProduct = async (req, res) => {
    try {

        const { ProductName, ProductPrice, ProductDescription, ProductCategory, SubCategory, ProductImage, ProductSize } = req.body; //Create a new instance of the model with data
        if (!ProductName || !ProductPrice || !ProductDescription || !ProductCategory || !SubCategory || !ProductImage || !ProductSize) {
            return res.status(400).json({ message: "Fill in all fields" });
        }
        else {
            //Create new product record using the product model
            const newProduct = await Product.create({
                ProductName,
                ProductPrice,
                ProductDescription,
                ProductCategory,
                SubCategory,
                ProductImage,
                ProductSize
            });
            console.log("New product created");
            res.status(201).json({ message: 'New Product created', result: newProduct });
        }
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
        categoryId: req.body.categoryId
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