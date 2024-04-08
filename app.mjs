//import AdminJSExpress from '@adminjs/express';
//import * as AdminJSSequelize from '@adminjs/sequelize';
//import AdminJS from 'adminjs';
import bodyParser from 'body-parser';
//import connectSessionSequelize from 'connect-session-sequelize';
//import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { router } from './routes/rts.js';
const app = express();

// Set up middleware and routes
app.use(cors());
//app.use(cookieParser());
app.use(express.static('public'));
//app.use(admin.options.rootPath, adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use AdminJS router


// Use customer routes
app.use('/', router);

// Start the server
app.listen(6000, () => {
    console.log(`SERVER RUNNING, AdminJS started on https://kcoat.onrender.com`);
});
//}
