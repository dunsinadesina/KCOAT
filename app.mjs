import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import AdminJS from 'adminjs';
import bodyParser from 'body-parser';
import connectSessionSequelize from 'connect-session-sequelize';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { sequelize } from './backend/config/connection.js';
import { Cart, CartItem } from './backend/model/cart.js';
import { Customer } from './backend/model/customer.js';
import { Order } from './backend/model/orders.js';
import { Payment } from './backend/model/payment.js';
import { Product } from './backend/model/products.js';
import { router } from './routes/rts.js';

AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
})
const PORT = 3000;
const sessionSecret = 'KCOAT';
const DEFAULT_ADMIN = {
    email: 'jesudunsinadesina@gmail.com',
    password: 'Dunsin23',
}

const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

const start = async () => {
    const app = express()
    const adminOptions = {
        // We pass Customer to `resources`
        resources: [
            Customer,
            Cart,
            CartItem,
            Order,
            Payment,
            Product
        ],
    }

    const userResource = {
        resource: Customer,
        options: {
            actions: {
                new: {
                    before: async (request) => {
                        if (request.payload?.password) {
                            request.payload.password = hash(request.payload.password);
                        }
                        return request;
                    },
                },
                show: {
                    after: async (response) => {
                        response.record.params.password = '';
                        return response;
                    },
                },
                edit: {
                    before: async (request) => {
                        // no need to hash on GET requests, we'll remove passwords there anyway
                        if (request.method === 'post') {
                            // hash only if password is present, delete otherwise
                            // so we don't overwrite it
                            if (request.payload?.password) {
                                request.payload.password = hash(request.payload.password);
                            } else {
                                delete request.payload?.password;
                            }
                        }
                        return request;
                    },
                    after: async (response) => {
                        response.record.params.password = '';
                        return response;
                    },
                },
                list: {
                    after: async (response) => {
                        response.records.forEach((record) => {
                            record.params.password = '';
                        });
                        return response;
                    },
                },
            },
            properties: {
                password: {
                    isVisible: {
                        list: false,
                        filter: false,
                        show: false,
                        edit: true, // we only show it in the edit view
                    },
                },
            },
        },
    };

    const someResource = {
        resource: Product,
        options: {
            actions: {
                insertProduct: {
                    isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
                },
                updateProductById: {
                    isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
                },
                deleteProduct: {
                    isAccessible: ({ currentAdmin }) => currentAdmin.role === 'admin',
                },
            },
        },
    };


    const UserResource = {
        resource: Product,
        options: {
            actions: {
                myCustomAction: {
                    actionType: 'record',
                    component: false,
                    handler: function (request, response, context) {
                        const { record, currentAdmin } = context;
                        return {
                            record: record.toJSON(currentAdmin),
                        };
                    },
                    guard: 'doYouReallyWantToDoThis',
                },
            },
        },
    };


    // Initialize AdminJS
    const admin = new AdminJS(adminOptions);
    const SequelizeStore = connectSessionSequelize(session.Store);
    const sessionStore = new SequelizeStore({
        db: sequelize,
        tableName: 'Session',
        expiration: 24 * 60 * 60 * 1000, //1 day expiration time
    });
    //register session middleware
    app.use(session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
    }));
    // Build AdminJS router
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
        },
        null,
        {
            store: sessionStore,
            resave: true,
            saveUninitialized: true,
            secret: sessionSecret,
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production'
            },
            name: 'adminjs'
        }
    );
    // Set up middleware and routes
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static('public'));
    // Use AdminJS router
    app.use(admin.options.rootPath, adminRouter);

    // Use customer routes
    app.use('/', router);

    // Start the server
    app.listen(PORT, () => {
        console.log(`SERVER RUNNING, AdminJS started on https://kcoat.onrender.com${admin.options.rootPath}`);
    });
}

start();