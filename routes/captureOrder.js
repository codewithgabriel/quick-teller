const express = require('express')
const route = express.Router()
const paypal = require('./paypal-api');


route.post('/' ,  async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = route
