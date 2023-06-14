require('dotenv').config()
const express = require('express')
const route = express.Router()
const path =  require('url')



route.get('/' , function(req, res){
    const param = path.parse(req.url , true).query;
    process.env.currency = param.currency;
    process.env.price = param.price;
    res.render('paypal', {currency: param.currency , clientId: process.env.CLIENT_ID , sku: param.sku , price: param.price , quantity: param.quantity});
})



module.exports = route
