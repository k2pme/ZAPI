require('dotenv').config()
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const bcrypt = require('bcryptjs')

const {Tokens} = require('../Models/Tokens')
const mongo = require('mongodb')

const controllers = require('../Controlers/login')


module.exports.tokenController = async (req, res) => {
    
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new mongo.MongoClient(uri, { useNewUrlParser : true, useUnifiedTopology : true});  // creating for mongodb client connection
    const decode = jwt.verify(req.cookies.jwt, process.env.TI_KANGULU);    

    if(decode){


        
        await client.connect();
        const db = client.db('ZAPI');
        const collection = db.collection("Auth");
        const client_id = decode.id

        const cl = await collection.findOne({client_id})
        //console.log(cl);
        if(cl){
            //console.log(cl);
            res.send("Vous avez deja un jeton");

        }else{

            Tokens.client_id = client_id;
            const uuid = 'd6cb834c-8ca2-4639-9a07-caa0fe4a0816';
            bcrypt.genSalt(11).then(salt => {
                bcrypt.hash(uuid, salt).then(hash => {
                    Tokens.uuid = uuid;
                    const token = jwt.sign(Tokens, process.env.TI_KANGULU);
                    
                    Tokens.uuid = hash;

                    collection.insertOne(Tokens);
                    res.send({client_id : decode.id, token : token});
                })
            })
        } 
        

        
    }else{
        console.log('ok')
    }

    
    

}