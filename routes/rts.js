const express = require('express');
const router = express.Router();
//Import middleware and controllers
const { mid } = require('../backend/middleware/mwd')
const { verifyAuth } = require('../backend/middleware/auth')
const { signup } = require('../backend/controllers/signup')
const { login } = require('../backend/controllers/login')
const { home, about, details } = require('../backend/controllers/users')
const { resetPassword } = require('../backend/controllers/resetPassword')
//const { insertCus } = require('../backend/controllers/customer-controller')
const { insertProduct, getAllProducts, getProductById, updateProductById, deleteProduct } = require('../backend/controllers/product-controller')
const {productSearch} = require('../backend/controllers/product-search')
const {createOrder} = require('../backend/controllers/order-controller')
// Define routes
// router.get('/', home)
router.get('/login', mid, login)
//router.post('/register', insertCus)
router.post('/createproduct', insertProduct)
router.get('/products', getAllProducts, productSearch)
router.get('/products/:Productid', getProductById)
router.put('/products/:Productid', updateProductById)
router.delete('products/:Productid', deleteProduct)
router.post('/createorder', createOrder)
//router.use(verifyAuth)
// router.get('/details', verifyAuth, details)
router.get('/reset', resetPassword)
router.post('/signup', signup)
//Export router
module.exports = { router };