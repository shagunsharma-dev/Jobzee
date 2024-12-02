// payment.js

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("sk_test_51PWcoqDZOVWZADldz8laLWVMw65oRH82t64qsLwYuF1ITMY3eaqsgkKn4Yv5yZPBuv0lzjR2fHJ2Bp0CGK6Nz6Gw00Qyvc2JHO");

const router = express.Router();

router.post("/payment", async (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempotencyKey = uuidv4();

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const charge = await stripe.charges.create({
      amount: product.price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: `purchase of ${product.name}`,
      shipping: {
        name: token.card.name,
        address: {
          country: token.card.address_country
        }
      }
    }, { idempotencyKey });

    console.log("Charge:", charge);
    res.status(200).json(charge);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
