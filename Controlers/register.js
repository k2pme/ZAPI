const mongo  = require('mongodb');
const ClientsModel = require('../Models/Clients')
const bcrypt = require('bcryptjs');


module.exports.register = async (req, res) => {

    let Clients = ClientsModel.Clients;
    Clients.email = req.body.email;
    Clients.name = req.body.name;
    Clients.password = req.body.password;


    console.log(Clients);

    const uri = 'mongodb://127.0.0.1:27017';
    const client = new mongo.MongoClient(uri, { useNewUrlParser : true, useUnifiedTopology : true});  // creating for mongodb client connection

    await client.connect();
    const db = client.db('ZAPI');
    const collection = db.collection("Clients");

    if(await collection.findOne({email : Clients.email})){
        res.send("il existe");
        
    }else{
        bcrypt.genSalt(11).then((salt)=>{
            bcrypt.hash(Clients.password, salt).then((hash)=>{
                Clients.password = hash;
                collection.insertOne(Clients)
                res.send("Sucess");

            }, (err) => {
                res.send("erreur serveur").status(500);
            })
        }, (err)=>{
            res.send("Erreur serveur").status(500);
        });
    }

}