// routes/stripe.js
const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../Controller/Stripe');

router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
