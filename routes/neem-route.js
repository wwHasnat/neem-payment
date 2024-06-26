const express = require("express");
const router = express.Router();
const NeemController = require("../controllers/neem.controller");
const { validateCustomer, initaitePayment } = require("../middlewares/validators");
const { apiCall } = require("../controllers/prodTest.controller");
 

// router.get("/get-token", NeemController.getToken);
router.post("/validate-customer",validateCustomer, NeemController.validateCustomer);
router.post("/inittiate-payment",initaitePayment, NeemController.initaitePayment);
router.get("/get-banks", NeemController.getBanks);
router.post("/api-call", apiCall);
 
module.exports = router;
