// Using Express
const express = require('express');
const app = express();
const route = express.Router();


const stripe = require('stripe')('sk_test_51NH5RHCsLbvLk5lqYy2Yc2wp5BLYBHXhlpbeRIff3OAicBVLupoTGfuVYKhADWSVrjjFdz0JExgeHfy8poMXqBkb00jg30C2Uh');

// Endpoint for when `/pay` is called from client
route.post('/', async (request, response) => {
  try {
    // Create the PaymentIntent
    let intent = await stripe.paymentIntents.create({
      amount: parseInt(request.body.amount) * 100,
      currency: request.body.currency,
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
      // Something else happened
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


module.exports = route