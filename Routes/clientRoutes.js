const express = require('express');
const crypto = require('crypto');

const clientRoutes = express.Router();


clientRoutes.use(express.json())
clientRoutes.use(express.urlencoded({extended : true}));

clientRoutes.get('/', (req, res, next) => {
    res.send('<b>Willkomen to your space dear customer</b>, see what you can do below 👇\n 1- /sign_in/:name/:prenoun/:birth : for showing your data');
});

clientRoutes.get('/:name/:prenoun/:birth', (req, res, next) => {
    res.send(`your firstname is ${req.params.name}\nyour prenoum is ${req.params.prenoun}\nyour birthday is ${req.params.birth}`);
});

clientRoutes.post('/login', (req, res, next) => {
    console.log(`${Date()}`)
    console.log("Lancement du service de hashage\n")
    const md5 = crypto.createHash('md5').update(req.body.phrase).digest('hex')
    res.send({'date' : Date(), 'phrase' : req.body.phrase, 'crypto' : md5});
});


module.exports = clientRoutes;