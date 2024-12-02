import React, { useState } from 'react';
import StripeCheckout from "react-stripe-checkout";
 
const Payment = () => {
  const [product] = useState({
    name: "React From FB",
    price: 10,
    productBy: "facebook"
  });

  const makePayment = token => {
    const body = {
      token,
      product
    };
    const headers = {
      "Content-Type": "application/json"
    };

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log("RESPONSE", response);
        const { status } = response;
        console.log("STATUS", status);
        // Handle success or failure as needed
      })
      .catch(error => console.error("ERROR", error));
  };

  return (
    <div className="payment-container">
      <h2>Payment Page</h2>
      <StripeCheckout
        stripeKey="pk_test_51PWcoqDZOVWZADldk3ztgBTwSmSJCbaCfzSuxszeZRQN5P6dfQIaWBBEF9yLKcH5KNG6PAzMMGAJghcC82D9yM1g00SZHf3FgV"
        token={makePayment}
        name="Buy React"
        amount={product.price * 100}
      >
        <button className="btn-large blue">Buy React for ${product.price}</button>
      </StripeCheckout>
 
    </div>
  );
};

export default Payment;
