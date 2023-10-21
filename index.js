const express = require('express');
const clientRoutes = require('./Routes/clientRoutes.js');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./Routes/apiRoutes.js')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 4002;

app.use('/client', clientRoutes);
app.use('/api', apiRoutes)
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (req, res, next) => {
    res.send('<b>Hallo !, wie geht\'s ?</b>, willkomen in our server 😊\n see services below 👇');

})

app.listen(PORT, ()=> {
    console.log(`En ecoute sur le port ${PORT}`);
});

