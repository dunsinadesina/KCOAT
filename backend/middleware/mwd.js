//Define middleware function
const mid = async (req, res, next) => {
    // req.text("some text here")
    console.log('send middleware')
    next();//Call next to pass control to the next middleware function in the stack
};

module.exports = { mid }