
const stripe = Stripe("sk_test_51N0O2pAZozJ35Fx7sLFZZv3tuOuzLjyzmqqNAr48VNv3Bf38PluwYb7ka5fOM4QhPLTbOooNhuj6hZ9DqzI4JodL006xwnr26A");

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
    resultContainer.textContent = result.error.message;
  } else {
    // Send paymentMethod.id to your server (see Step 3)
    const response = await fetch("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method_id: paymentMethod.id })
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