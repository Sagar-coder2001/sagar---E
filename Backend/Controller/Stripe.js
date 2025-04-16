// controller/stripe.js
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_API_KEY); // Ensure you have your Stripe secret key in your environment variables

exports.createCheckoutSession = async (req, res) => {
  try {
    const { products, totalAmount, user, selectaddress } = req.body;

    const line_items = products.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
        },
        unit_amount: item.product.price * 100, // cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email: user.email, // optional
      success_url: `https://sagar-e.vercel.app/Ordersuccesspage`,
      cancel_url: `https://sagar-e.vercel.app/cart`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
