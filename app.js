const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {router} = require('./routes/rts')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use((req, res, next)=>{
    res.locals.username = "myUsername"
    next()
})

app.use((req, res, next)=>{
    // console.log(res.locals.username)
    // console.log(req.text)
    next()
})

app.use('/',router);
app.listen(6000,function(){
    console.log("Server Running")
})