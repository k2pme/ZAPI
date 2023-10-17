const loginMidddleware = (req, res, next) =>{

    if(req.body.email && req.body.password){
        next();
    }else{
        res.send("Inserer votre email et votre mot de passe");
    } 
}

module.exports = loginMidddleware;