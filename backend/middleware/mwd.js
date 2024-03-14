const mid = async (req, res, next) => {
    // req.text("some text here")
    console.log('send middleware')
    next();
};

module.exports = { mid }