const { Router } = require("express");
const { verifyToken } = require("../middlewares/auth.middleware");
const { checkTrial } = require("../controllers/checkTrial.controller");

const trialRoute=Router()

trialRoute.post("/",verifyToken,checkTrial.checkTrialComplete)

module.exports={trialRoute};