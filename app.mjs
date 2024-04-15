import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { stripe } from './backend/controllers/payment-controller';
import { router } from './routes/rts.js';
const app = express();
// Set up middleware and routes
app.use(cors());
//app.use(cookieParser());
app.use(express.static('public'));
//app.use(admin.options.rootPath, adminRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);
app.use('/stripe', stripe);

// Start the server
app.listen(6000, () => {
    console.log(`SERVER RUNNING, AdminJS started on https://kcoat.onrender.com`);
});
//}
