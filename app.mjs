import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { router } from './routes/rts.js';
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

// Start the server
app.listen(6000, () => {
    console.log(`SERVER RUNNING, Server started on https://kcoat.onrender.com`);
});

import models from './backend/model/index.js';
import { sequelize } from './backend/config/connection.js';

// Sync all models
sequelize.sync({ force: false })
    .then(() => {
        console.log("All models were synchronized successfully.");
    })
    .catch((err) => {
        console.error("Error synchronizing models:", err);
    });