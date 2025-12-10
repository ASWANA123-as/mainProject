require("dotenv").config();
const Stripe = require("stripe");
const Event = require("../Modal/EventModal");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ ERROR: STRIPE_SECRET_KEY is missing in .env");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  console.log(req.body,'iiioo')
  try {
    const { eventId, amount } = req.body;

    console.log("Incoming Payload:", req.body);

    // Validate payload
    if (!eventId || !amount) {
      return res.status(400).json({ message: "eventId and amount are required" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a valid number > 0" });
    }

    // Build Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Event Ticket #${eventId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.FRONTEND_URL}/payment-success?eventId=${eventId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    console.log("Stripe Session Created:", session.id);

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("❌ Stripe Error:", error);
    return res.status(500).json({
      message: "Payment initialization failed",
      error: error.message,
    });
  }
};
const verifyPaymentAndRegister = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const eventId = req.query.eventId;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Register user for the event
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: req.user.id } },
      { new: true }
    );

    return res.status(200).json({ message: "Registration + Payment Successful" });

  } catch (err) {
    return res.status(500).json({ message: "Verification failed" });
  }
};

module.exports = { createCheckoutSession,verifyPaymentAndRegister };
