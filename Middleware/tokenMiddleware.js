require('dotenv').config()

module.exports.tokenMiddleware = (req, res, next) =>{
    if(req.cookies.refresh){
        res.writeContinue();
        next()
    }else{
        res.send('connecter vous avant !').status(400);
    }
}