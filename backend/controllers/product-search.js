const { Sequelize } = require('sequelize');
const { Product } = require('../model/products');
const productSearch = async (req, res) => {
    try {
        const { searchKeyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const query = {
            where: {},
            offset,
            limit: parseInt(limit), //comnvet limit to number
        }
        //validate user input
        if (typeof searchKeyword !== 'string') {
            return res.status(400).json({ error: 'Invalid search keyword' });
        } else if (searchKeyword !== undefined) {
            query.where.ProductName = { [Sequelize.Op.like]: `%${searchKeyword}%` };
        }
        if (category !== undefined && typeof category !== 'string') {
            return res.status(400).json({ error: 'Invalid category keyword' });
        } else if (category !== undefined) {
            query.where.ProductCategory = category;
        }
        if (minPrice !== undefined && isNaN(minPrice)) {
            return res.status(400).json({ error: 'Invalid minimum price' });
        }
        if (maxPrice !== undefined && isNaN(maxPrice)) {
            return res.status(400).json({ error: 'Invalid maximum price' });
        }
        if (minPrice !== undefined && maxPrice !== undefined && parseFloat(maxPrice) < parseFloat(minPrice)) {
            return res.status(400).json({ error: 'Maximum Price must be greater than or equal to minimum price' });
        }
        const products = await Product.findAll(query);
        res.status(200).json(products);
    } catch (error) {
        console.log("Error encountered while searching for products", error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally{
        try {
            await sequelize.close();
            console.log('Database connection closed successfully.');
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    }
    
}

module.exports = { productSearch }