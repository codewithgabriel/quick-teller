require('dotenv').config();
const fetch =  require('node-fetch-commonjs');



const { LIVE_CLIENT_ID, LIVE_SECRET_ID } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const createOrder = async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: process.env.currency,
            value: process.env.price,
          },
        },
      ],
    }),
  });

  return handleResponse(response);
}

const capturePayment =  async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

const generateAccessToken = async function generateAccessToken() {
  const auth = Buffer.from(LIVE_CLIENT_ID + ":" + LIVE_SECRET_ID).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}


module.exports = {
  generateAccessToken: generateAccessToken ,
  createOrder: createOrder,
  capturePayment: capturePayment
}
