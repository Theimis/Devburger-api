import Stripe from "stripe";
import * as Yup from "yup";


const stripe = new Stripe(
  "sk_test_51QKf9BAK9EZcPjY6Oo2TuenZx8kAlv1iJ7ZwTw6L4VXSv2pWkg8uMGt2Qx6ewO70ErMdt5Ilp1PEJ6LfAVKO9CCu006X1mnU6y",
); 

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return acc + current.price * current.quantity;
  }, 0);

  return total * 100;
};

class CreatePaymentIntentController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          }),
        ),
    });
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const amount = calculateOrderAmount(products);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    response.json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  }
}

export default new CreatePaymentIntentController();
