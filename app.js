const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {router} = require('./routes/rts')
//Enable CORS middleware
app.use(cors());
//Parse incoming JSON requests
app.use(bodyParser.json());
// Parse incoming URL-encoded requests
app.use(bodyParser.urlencoded({extended:false}))
//Middleware to attach a 'username' property to res.locals
app.use((req, res, next)=>{
    res.locals.username = "myUsername"
    next()
})

app.use((req, res, next)=>{
    // console.log(res.locals.username)
    // console.log(req.text)
    next()
})
//Use the router defined in './routes/rts' for routing
app.use('/',router);
//Start the server on port 6000
app.listen(6000,function(){
    console.log("Server Running")
})