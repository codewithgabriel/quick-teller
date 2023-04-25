const express = require("express");
const router = express.Router();
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")("sk_test_51N0O2pAZozJ35Fx7sLFZZv3tuOuzLjyzmqqNAr48VNv3Bf38PluwYb7ka5fOM4QhPLTbOooNhuj6hZ9DqzI4JodL006xwnr26A");



const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

router.post("/", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


module.exports =  router