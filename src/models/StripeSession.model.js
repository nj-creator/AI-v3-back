
const mongoose = require("mongoose");

const stripeSessionSchema = mongoose.Schema({

    sessionId: String,
    customerId: String,
    subscriptionId: String,
    subscriptionStatus: String,
    subscriptionEndDate: { type: mongoose.Schema.Types.Date }

});




module.exports = mongoose.model("stripeSession", stripeSessionSchema);