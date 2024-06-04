const StripeSessionModel = require("../models/StripeSession.model");
const { User } = require("../models/user.model");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const Stripe_Webhook = async (req, res) => {
  const { data, type } = req.body;

  console.log(type, "webhook type");

  console.log(data.object, "webhook data");

  // if (type === "customer.subscription.created") {
  //   stripe.subscriptions.retrieve(data.object.id, async (err, subscription) => {
  //     if (err) {
  //       console.error("Error fetching subscription details:", err);

  //     } else {
  //       if (subscription.trial_end) {
  //         await StripeSessionModel.findOneAndUpdate(
  //           { sessionId: data.object.id },
  //           {
  //             subscriptionStatus: data.object.payment_status,
  //             subscriptionEndDate: new Date(
  //               subscription.trial_end * 1000
  //             ).toISOString(),
  //           }
  //         );

  //         await User.findOneAndUpdate(
  //           { stripeCustomerId: subscription.customer }
  //         );

  //       } else {
  //         await StripeSessionModel.findOneAndUpdate(
  //           { sessionId: data.object.id },
  //           {
  //             subscriptionStatus: data.object.payment_status,
  //             subscriptionEndDate: new Date(
  //               subscription.current_period_end * 1000
  //             ).toISOString(),
  //           }
  //         );

  //         await UserModel.findOneAndUpdate(
  //           { stripe_customer_id: subscription.customer },
  //           {
  //             subscriptionEndDate: new Date(
  //               subscription.current_period_end * 1000
  //             ).toISOString(),
  //           }
  //         );

  //       }
  //     }
  //   });
  // }

  return res.status(200).json({ message: "Webhook called successfully" });

};

module.exports = Stripe_Webhook;
