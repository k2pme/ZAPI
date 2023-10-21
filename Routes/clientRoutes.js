const express = require('express');
const cookieParser = require('cookie-parser');
const log  = require('../Controlers/login');
const loginMiddleware = require('../Middleware/login_mid');
const {register} = require('../Controlers/register')
const {registerMiddleware} = require('../Middleware/register_middleware')

const clientRoutes = express.Router();


clientRoutes.use(express.json())
clientRoutes.use(express.urlencoded({extended : true}));
clientRoutes.use(cookieParser());

clientRoutes.post('/login', loginMiddleware, log.login);
clientRoutes.post('/register', registerMiddleware, register);


module.exports = clientRoutes;