import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import bodyParser from 'body-parser';
import Connect from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { sequelize } from './backend/config/connection.js';
import { router } from './routes/rts.js';
export const start = async () => {
    const app = express()

    // Initialize AdminJS
    const admin = new AdminJS({})
    const authenticate = async (email, password) => {
        try {
            // Find the user by email
            const user = await Customer.findOne({ where: { email } });
            
            // If the user is found and the password matches, return the user
            if (user && await bcrypt.compare(password, user.password)) {
                return user;
            } else {
                return null; // Return null if authentication fails
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            throw new Error('Error during authentication');
        }
    };
    // Initialize session store
    const ConnectSession = Connect(session)
    const sessionStore = new ConnectSession({
        conObject: {
            connectionString: sequelize,
            ssl: process.env.NODE_ENV === 'production',
        },
        tableName: 'session',
        createTableIfMissing: true,
    })

    // Build AdminJS router
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'sessionsecret',
        },
        null,
        {
            store: sessionStore,
            resave: true,
            saveUninitialized: true,
            secret: 'sessionsecret',
            cookie: {
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            },
            name: 'adminjs',
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
    app.listen(6000, () => {
        console.log("Server running, AdminJS started on https://kcoat.onrender.com/admin");
    });
}

start();