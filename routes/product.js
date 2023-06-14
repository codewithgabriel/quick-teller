const express = require('express')
const route = express.Router()

route.use('/' , function(req, res){
    res.render('product');
})



module.exports = route
