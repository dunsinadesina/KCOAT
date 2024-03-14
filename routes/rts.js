const express = require('express');
const router = express.Router();
const { mid } = require('../backend/middleware/mwd')
const { verifyAuth } = require('../backend/middleware/auth')
const { signup } = require('../backend/controllers/signup')
const { login } = require('../backend/controllers/login')
const { home, about, details } = require('../backend/controllers/users')
const { resetPassword } = require('../backend/controllers/resetPassword')
const { insertCus } = require('../backend/controllers/customer-controller')

// router.get('/', home)
router.get('/login', mid, login)
router.post('/register', insertCus)
// router.get('/details', verifyAuth, details)
router.get('/reset', resetPassword)
router.post('/signup', signup)

module.exports = { router };