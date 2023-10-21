const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs')

const client = require('../Models/Clients')



require('dotenv').config()


module.exports.login = async (req, res) => {

   try{             //POUR CEUX QUI POSSEDE DEJA UN TOKEN ACCESS TOKEN VALIDE

        const decode = jwt.verify(req.cookies.jwt, process.env.TI_KANGULU);
        const rep = await token_db_connexion(decode)
        
        if(rep.status){         // Si le token verifie le client
            console.log(rep);
            const token = jwt.sign({id : rep.data._id, email : rep.data.email}, process.env.TI_KANGULU);        // Renouvellement du access token
            const refreshToken = jwt.sign(decode, process.env.TI_KANGULU);      // Creation du refresh token pour la session du client


            // Option des token
            // Option du access token
            const tokenOption = {
                maxAge : 3*24*60*60*1000,       // 3 jours de validite     
                httpOnly: true,                 // Acces en htttp seulement
                secure : false,                 // Transfert en HTTP permit
            };

            // Option du refresh token
            const refreshOption = {  
                httpOnly: true, 
                secure : false,
            };

            //Reponse du serveur
            res.cookie('jwt', token, tokenOption)
            res.cookie('refresh', refreshToken, refreshOption);
            res.json({status : true, client : {name : rep.data.name, email : rep.data.email}});

            return;
            
        }else{          /*  Si le access token n'est plus valide 
                            on declenche une exception afin d'executer la portion catch*/
            throw Error;
        }


    }catch(err){        // SI IL N'Y A PLUS D'ACCESS TOKEN ALORS ON L'AUTHENTIFIE TRADITIONNELEMENT

        const rep = await db_connexion(req.body.email)      //-> Returne un document

        if(rep.status){     // Si l'email est connue dans la base de donnees
            bcrypt.compare(rep.data.password, req.body.password).then((sucess)=>{       // compare le mot de passe
                
                const token = jwt.sign({id : rep.data._id, email : rep.data.email}, process.env.TI_KANGULU);            // Creation du access token
                const refreshToken = jwt.sign({id : rep.data._id, email : rep.data.email}, process.env.TI_KANGULU);     // Creation du refresh token

                const cookieOption = { 
                    maxAge : 259200000, 
                    httpOnly: true, 
                    secure : false,
                };

                const refreshOption = {  
                    httpOnly: true, 
                    secure : false,
                };

                res.cookie('jwt', token, cookieOption)
                res.cookie('refresh', refreshToken, refreshOption);
                res.json({status : true, client : {name : rep.name, email : rep.email}, token : true});

                return;

            })
        }else{
            res.send('Inscrivez vous avant de vous connecter');
            return;
        }
    } 
}


const token_db_connexion = async (decode) => {
        
    const email = decode.email;
    const id = decode.id;

    try{

        const uri = 'mongodb://127.0.0.1:27017';
        const client = new mongo.MongoClient(uri, { useNewUrlParser : true, useUnifiedTopology : true});  // creating for mongodb client connection

        await client.connect();
        const db = client.db('ZAPI');
        const collection = db.collection("Clients");
        const cl = await collection.findOne({email});

        if(String(cl._id) === id) {
            return {status : true, data : cl};
        }else{
            return {status : false, data : "Votre email est inconnue"};
        }


    }catch(Exception){

        console.log(`erreur ${Exception}`);

    }
    
    
}



const db_connexion = async (email) => {

try{

        const uri = 'mongodb://127.0.0.1:27017';
        const client = new mongo.MongoClient(uri, { useNewUrlParser : true, useUnifiedTopology : true});  // creating for mongodb client connection

        await client.connect();
        const db = client.db('ZAPI');
        const collection = db.collection("Clients");

        const cl = await collection.findOne({email});

        if(cl) {
            return {status : true, data : cl};
        }else{
            return {status : false, data : "Votre email est inconnue"};
        }


    }catch(err){

        console.log(`erreur ${err}`);

    }


};

module.exports.loginWithToken = async payload => {
    return token_db_connexion(payload);
}