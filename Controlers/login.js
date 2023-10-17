const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs')

const client = require('../Models/Clients')



require('dotenv').config()


module.exports.login = async (req, res) => {

   try{
        const decode = jwt.verify(req.cookies.jwt, process.env.TI_KANGULU);
        const rep = await token_db_connexion(decode.email)

        if(rep.status){
            if(rep.data._id == decode.id){
                const token = jwt.sign({id : rep.data._id, email : rep.data.email}, process.env.TI_KANGULU);

                const cookieOption = { 
                    maxAge : 259200000, 
                    httpOnly: true, 
                    secure : false,
                };

                res.cookie('jwt', token, cookieOption)
                res.json({status : true, client : {name : rep.data.name, email : rep.data.email}});
            }
        }else{
            throw Error;
        }

    }catch(err){
        const rep = await token_db_connexion(req.body.email)

        if(rep.status){
            bcrypt.compare(rep.data.password, req.body.password).then((sucess)=>{
                
                const token = jwt.sign({id : rep.data._id, email : rep.data.email}, process.env.TI_KANGULU);

                const cookieOption = { 
                    maxAge : 259200000, 
                    httpOnly: true, 
                    secure : false,
                };

                res.cookie('jwt', token, cookieOption)
                res.json({status : true, client : {name : rep.name, email : rep.email}, token : true});

                return;

            })
        }else{
            console.log("Echec ....")
        }
    } 
}


const token_db_connexion = async (email) => {

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
    
    
}

