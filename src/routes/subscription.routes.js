const express = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const { CreateCheckoutSession } = require("../controllers/stripe.controller");


const subscriptionRoutes = express();

subscriptionRoutes.post("/checkout", [verifyToken], CreateCheckoutSession);

module.exports = subscriptionRoutes;
