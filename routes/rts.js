import express from 'express';
export const router = express.Router();
//Import middleware and controllers
import { addToCart, checkOut, cleanUpOldCarts, retrieveCart } from '../backend/controllers/cart-controller.js';
import { insertCus, verifyEmail } from '../backend/controllers/customer-controller.js';
import { login, logout } from '../backend/controllers/login.js';
import { calcOrderTotal, cancelOrder, convertCartToOrder, createOrder, updateOrder, updateOrderStatus, viewOrders, viewParticularOrder } from '../backend/controllers/order-controller.js';
import { checkoutPayment, webHook } from '../backend/controllers/payment-controller.js';
import { deleteProduct, getAllProducts, getProductByCategory, getProductById, getProductBySubCategory, insertProduct, updateProductById } from '../backend/controllers/product-controller.js';
import { resetPassword } from '../backend/controllers/resetPassword.js';
import { isAdmin } from '../backend/middleware/auth.js';
import { mid } from '../backend/middleware/mwd.js';
// Define routes
// router.get('/', home)
router.post('/login', mid, login)
router.post('/logout', logout)
router.post('/register', insertCus)
router.post( '/verify-email', verifyEmail)
router.post('/products', insertProduct)
router.get('/products', getAllProducts)
router.get('/products/:Productid', getProductById)
router.get('/products/:category', getProductByCategory);
router.get('/products/:category/:subcategory', getProductBySubCategory)
router.put('/products/:Productid', updateProductById)
router.delete('products/:Productid', deleteProduct)
router.post('/createorder', createOrder)
router.get('/vieworders', viewOrders)
router.get('/orders/:orderId', viewParticularOrder)
router.put('/orders/:orderId', updateOrder)
router.put('/orders/:orderId/status', updateOrderStatus)
router.delete('/orders/:orderId', cancelOrder)
router.get('/orders/:orderId/calculateTotal', calcOrderTotal)
router.put('/insertintocart', addToCart)
router.delete('/checkout', checkOut)
router.post('/retrievecart', retrieveCart)
router.delete('/cleanup', cleanUpOldCarts)
router.post('/convertcarttoorder', convertCartToOrder)
router.post('create-checkout-session', checkoutPayment)
router.post('/webhook', express.raw({type:'application/json'}),webHook)
router.get('/admin-dashboard', isAdmin, (req, res) => {
    res.json({ message: 'Admin dashboard accessed successfully' })
})
// router.get('/details', verifyAuth, details)
router.get('/reset', resetPassword)