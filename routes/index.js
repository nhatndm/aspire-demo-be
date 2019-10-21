const authController = require("../controllers/auth");
const loansController = require("../controllers/loans");
const authMiddleware = require("../middleware/auth");
const express = require("express");

module.exports = app => {
  const authRoutes = express.Router();
  const loansRoutes = express.Router();

  authRoutes.get("/verify", authController.verifyToken);

  loansRoutes.get("/", authMiddleware.verifyToken, loansController.getLoans);
  loansRoutes.get("/:id", loansController.getLoanDetails);
  loansRoutes.put(
    "/:idloanDeTail/repayment",
    authMiddleware.verifyToken,
    loansController.loanRePayment
  );

  app.use("/auth", authRoutes);
  app.use("/loans", loansRoutes);
};
