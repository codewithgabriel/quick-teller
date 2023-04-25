// Using Express
const express = require('express');
const router = express.Router();
router.use(express.json());
const { resolve } = require("path");

const stripe = require('stripe')('sk_test_51N0O2pAZozJ35Fx7sLFZZv3tuOuzLjyzmqqNAr48VNv3Bf38PluwYb7ka5fOM4QhPLTbOooNhuj6hZ9DqzI4JodL006xwnr26A');

// Endpoint for when `/pay` is called from client
router.post('/', async (request, response) => {
  try {
    // Create the PaymentIntent
    let intent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      payment_method: request.body.payment_method_id,

      // A PaymentIntent can be confirmed some time after creation,
      // but here we want to confirm (collect payment) immediately.
      confirm: true,

      // If the payment requires any follow-up actions from the
      // customer, like two-factor authentication, Stripe will error
      // and you will need to prompt them for a new payment method.>
      error_on_requires_action: true
    });
    return generateResponse(response, intent);
  } catch (e) {
    if (e.type === 'StripeCardError') {
      // Display error on client
      return response.send({ error: e.message });
    } else {
      // Something else hrouterened
      return response.status(500).send({ error: e.type });
    }
  }
});

function generateResponse(response, intent) {
  if (intent.status === 'succeeded') {
    // Handle post-payment fulfillment
    return response.send({ success: true });
  } else {
    // Any other status would be unexpected, so error
    return response.status(500).send({error: 'Unexpected status ' + intent.status});
  }
}

module.exports = router