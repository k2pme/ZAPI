const express = require('express');
const cookieParser = require('cookie-parser')

//Controllers
const {tokenController} = require('../Controlers/token');
const {tokenMiddleware} = require('../Middleware/tokenMiddleware');
const apiRoutes = express.Router();


apiRoutes.use(express.json());
apiRoutes.use(express.urlencoded({extended : true}));
apiRoutes.use(cookieParser());


apiRoutes.get('/', (req, res, next)=>{
    res.send("willkommen ");
})

apiRoutes.post('/token', tokenMiddleware, tokenController);

module.exports = apiRoutes;
