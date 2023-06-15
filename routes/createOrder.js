const express = require('express')
const route = express.Router()
const paypal = require('./paypal-api');



route.post('/' ,  async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message);
  }
});


module.exports = route
