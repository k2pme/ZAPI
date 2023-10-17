module.exports.registerMiddleware = (req, res, next) => {
    if(req.body.name && req.body.email &&  req.body.password){
        next()
    }else{
        res.send("Vos donnees sont erroné ou sont imcomplets");
        return;
    }
}