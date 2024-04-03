const express = require('express');
const cors = require('cors');
//const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const { sequelize } = require('./backend/config/connection')
//const { Session } = require('./backend/model/session')
const { router } = require('./routes/rts')
const { isAdmin, isCustomer } = require('./backend/middleware/auth')
const app = express();
//Enable CORS middleware
app.use(cors());
//use cookieparser to parse  the cookies
app.use(cookieParser());
//Parse incoming JSON requests
app.use(bodyParser.json());
// Parse incoming URL-encoded requests
app.use(bodyParser.urlencoded({ extended: false }));
//Use the router defined in './routes/rts' for routing
app.use('/', router);
//Start the server on port 6000
app.listen(6000, function () {
    console.log("Server Running")
})