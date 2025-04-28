const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");

router.post("/accounts", controller.create);
router.get("/accounts/:user", controller.get);
router.delete("/accounts/:user", controller.delete);
router.post("/accounts/:user/transactions", controller.addTransaction);
router.delete("/accounts/:user/transactions/:id", controller.deleteTransaction);

module.exports = router;