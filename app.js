const express = require('express');
const cors = require('cors');
//const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const { sequelize } = require('./backend/config/connection')
const { Session } = require('./backend/model/session')
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
//generate csurf token and attach to responses
//app.use(csrf({ cookie: true }));
//middleware to add csurf token
 //app.use((req, res, next) => {
   //  res.locals.csrfToken = req.csrfToken();
     //next();
 //})
//Middleware to attach a 'username' property to res.locals
//app.use(express.json); // for parsing application/json
//  app.use(session({
//      secret: '9d8302441d4bda37e215d53829302aaa5a5e6bda66775ac4beca485fb131a678',
//      resave: false,
//      saveUninitialized: true
//  }));

// app.use((req, res, next) => {
//     res.locals.username = req.session.username || '';//retrieve username from session
//     next();
// })
// app.use((req, res, next) => {
//     console.log('Request Method:', req.method);
//     console.log('Username:', res.locals.username);
//     next();
// });
// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('Session table created successfully');
//     })
//     .catch(err => {
//         console.error('Error creating session table:', err);
//     });
// app.use((req, res, next) => {
//     console.log(res.locals.username)
//     console.log(req.text)
//     next()
// })
//Use the router defined in './routes/rts' for routing
app.use('/', router);
//Start the server on port 6000
app.listen(6000, function () {
    console.log("Server Running")
})