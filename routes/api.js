const router = require("express").Router();
const Transaction = require("../models/transaction.js");

// Create a transaction
router.post("/api/transaction", async (request, response) => {
  try {
    const { body } = request;

    const result = await Transaction.create(body);
    return response.json(result);

  } catch (error) {
    console.log(error);
    return response.status(500).send(error.message);
  }
});

// Bulk insert pending transactions
router.post("/api/transaction/bulk", async (request, response) => {
  try {
    const { body } = request;

    const result = await Transaction.insertMany(body);
    return response.json(result);

  } catch (error) {
    console.log(error);
    return response.status(500).send(error.message);
  }
});

// This path returns all the transactions entered in the system
router.get("/api/transaction", async (request, response) => {
  try {
    const result = await Transaction.find({}).sort({ date: -1 });
    return response.json(result);

  } catch (error) {
    console.log(error);
    return response.status(500).send(error.message);
  }
});

module.exports = router;