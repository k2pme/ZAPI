const express = require('express');
const clientRoutes = require('./clientRoutes.js');


const app = express()
const PORT = process.env.PORT || 4002;

app.use('/client', clientRoutes);
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res, next) => {
    res.send('<b>Hallo !, wie geht\'s ?</b>, willkomen in our server 😊\n see services below 👇');
})

app.listen(PORT, ()=> {
    console.log(`En ecoute sur le port ${PORT}`);
});

