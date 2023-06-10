
const stripe = Stripe("pk_test_51NH5RHCsLbvLk5lqbKGZXUN3v8wGDzMXi8xbbEEcA5Npz4wATkd7z9oKK6wghq1Eacbnj5Eedmry0hAuf49gtHA600JO45Wu08");

const elements = stripe.elements();


var style = {
  base: {
    color: "#32325d",
    fontFamily: 'Arial, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#32325d"
    }
  },
  invalid: {
    fontFamily: 'Arial, sans-serif',
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};


const cardElement = elements.create('card' ,  { style: style } );
cardElement.mount('#card-element');




const form = document.getElementById("payment-form");
const amount  = form['amount'];
const currency  = form['currency'];



var resultContainer = document.getElementById('payment-result');
cardElement.on('change', function(event) {
  if (event.error) {
    resultContainer.textContent = event.error.message;
  } else {
    resultContainer.textContent = '';
  }
});


console.log(cardElement)
form.addEventListener('submit', async event => {
  event.preventDefault();
  resultContainer.textContent = '';
  const result = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });
  handlePaymentMethodResult(result);
});

const handlePaymentMethodResult = async ({ paymentMethod, error }) => {
  if (error) {
    // An error happened when collecting card details, show error in payment form

    resultContainer.textContent = error.message;
  } else {
    // Send paymentMethod.id to your server (see Step 3)
    resultContainer.textContent = 'Processing Payment, Please wait...';

    const response = await fetch("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method_id: paymentMethod.id , amount: amount.value , currency: currency.value})
    });

    const responseJson = await response.json();

    handleServerResponse(responseJson);
  }
};

const handleServerResponse = async responseJson => {
  if (responseJson.error) {
    // An error happened when charging the card, show it in the payment form
    resultContainer.textContent = responseJson.error;
  } else {
    // Show a success message
    resultContainer.textContent = 'Success!';
  }
};
