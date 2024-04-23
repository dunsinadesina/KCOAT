import express from 'express';
export const router = express.Router();
//Import middleware and controllers
import { adminLogin } from '../backend/controllers/admin-controller.js';
import { insertCus, verifyEmail } from '../backend/controllers/customer-controller.js';
import { login, logout } from '../backend/controllers/login.js';
import { orderProduct, restockProduct } from '../backend/controllers/order-controller.js';
import { checkoutPayment, webHook } from '../backend/controllers/payment-controller.js';
import { deleteProduct, getAllProducts, getMostPopularProducts, getNewAndFeaturedProducts, getProductByCategory, getProductById, getProductBySubCategory, insertProduct, updateProductById, uploadImage } from '../backend/controllers/product-controller.js';
import { forgotPassword, resetPassword } from '../backend/controllers/resetPassword.js';
import { getAllUserProfiles, getUserProfile, updateUserProfile } from '../backend/controllers/userProfilecontroller.js';
import { sanitizeProductFields } from '../backend/middleware/auth.js';
import { mid } from '../backend/middleware/mwd.js';
// Define routes
// router.get('/', home)
router.post('/login', mid, login)
router.post('/admin-login', adminLogin)
router.post('/logout', logout)
router.post('/register', insertCus)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/products',uploadImage ,sanitizeProductFields, insertProduct)
router.get('/products', getAllProducts)
router.get('/products/:Productid', getProductById)
router.get('/products/category/:category', getProductByCategory);
router.get('/products/:category/:subcategory', getProductBySubCategory)
router.put('/products/:Productid', sanitizeProductFields, updateProductById)
router.delete('/products/:Productid', deleteProduct)
router.get('/most-popular-products', async (req, res) => {
    try {
        const popularProducts = await getMostPopularProducts();
        res.json(popularProducts);
    } catch (error) {
        console.log('Error in handling request: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/new-featured-products', getNewAndFeaturedProducts)
router.post('/createorder', orderProduct)
router.post('/restock', restockProduct)
router.post('/create-checkout-session', checkoutPayment)
router.get('/user-profile', getAllUserProfiles)
router.get('/user-profile/:cusid', getUserProfile)
router.put('/user-profile/:cusid', updateUserProfile)
router.post('/webhook', express.raw({ type: 'application/json' }), webHook)
// router.get('/details', verifyAuth, details)
router.put('/reset-password/:token', resetPassword)