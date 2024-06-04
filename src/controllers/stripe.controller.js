const StripeSessionModel = require("../models/StripeSession.model");
const { User } = require("../models/user.model");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const CreateCustomer = (email, name) => {
  return new Promise((res, rej) => {
    stripe.customers.create({ email, name }, (err, customer) => {
      if (err) {
        if (
          err.type === "StripeInvalidRequestError" &&
          err.code === "resource_already_exists"
        ) {
          console.error(
            "Customer with this email already exists:",
            err.message
          );
          // Handle the case where a customer with the same email already exists
          rej("Customer with this email already exists");
        } else {
          rej("Error creating customer");
          console.error("Error creating customer:", err);
          // Handle other errors as needed
        }
      } else {
        res(customer.id);
        return customer.id
        // Handle the customer data as needed
      }
    });
  });
};


const CreateCheckoutSession = async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    const user = await User.findOne({ stripeCustomerId: customerId });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customerId,
        line_items: [
          {
            price: priceId, // Replace with the actual Price ID
            quantity: 1,
          },
        ],
        mode: "subscription",
        // success_url: "https://app.immersfy.com", //production
        // cancel_url: "https://app.immersfy.com", //production
        success_url: "http://localhost:5173", //testing
        cancel_url: "http://localhost:5173", //testing
        // metadata: { framesNumber, regenerateNumber },
      });

      await StripeSessionModel.create({
        sessionId: session.id,
        customerId,
        subscriptionStatus: session.payment_status,
      });

      res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.log(error.raw.message, "create checkout session error");

    return res.status(500).json({
      message:
        error.raw.message ||
        "Error occured while creating the subscription session!",
    });
  }
};

// const CancelSubscription = async (req, res) => {
//   try {
//     const { customerId, usersId } = req.body;

//     const subscriptions = await stripe.subscriptions.list({
//       customer: customerId,
//     });

//     await stripe.subscriptions.update(subscriptions.data[0].id, {
//       cancel_at_period_end: true,
//     });

//     await UserModel.findByIdAndUpdate(usersId, {
//       subscriptionCancelled: true,
//       cancellation_date: new Date().toISOString(),
//     });

//     return res
//       .status(200)
//       .json({ message: "Cancel subscription called successfully" });
//   } catch (error) {
//     console.log(error, "cancel subscription error");

//     return res.status(500).json({ message: "Cancel subscription error" });
//   }
// };

module.exports = {
  CreateCustomer,
  CreateCheckoutSession,
  // CancelSubscription,
  // CreateCustomerUsingPhone,
};
