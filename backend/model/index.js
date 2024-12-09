import { Admin } from './admin.js';
import { Customer } from './customer.js';
import { Product } from './products.js';
import { Order } from './orders.js';
import { Cart, CartItem } from './cart.js';;
import { PasswordResetToken } from './passwordreset.js';
import { Payment } from './payment.js';
import { UserProfile } from './userprofile.js';

const models = {
    Admin,
    Customer,
    Product,
    Order,
    Cart,
    CartItem,
    PasswordResetToken,
    Payment,
    UserProfile
}

export default models