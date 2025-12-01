require("dotenv").config();
const Stripe = require("stripe");

// Ensure key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ ERROR: STRIPE_SECRET_KEY is missing in .env");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { eventId, amount } = req.body;

    // Validation
    if (!eventId || !amount) {
      return res.status(400).json({ message: "eventId and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Event Ticket #${eventId}` },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?eventId=${eventId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("❌ Stripe Error:", error);
    return res.status(500).json({ message: "Payment initialization failed", error: error.message });
  }
};

module.exports = { createCheckoutSession };
