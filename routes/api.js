const router = require("express").Router();
const Transaction = require("../models/transaction.js");

// Create a transaction
router.post("/api/transaction", async (request, response) => {
  try {
    const { name, value, date } = request.body;

    const result = await Transaction.create({ name, value, date });
    return response.json(result);

  } catch (error) {
    console.log(error);
    return response.status(500).send(error.message);
  }
});

// Bulk insert pending transactions
router.post("/api/transaction/bulk", async (request, response) => {
  try {
    const transactions = request.body.map(item =>
      ({
        "name": item.name,
        "value": item.value,
        "date": item.date
      }));

    const result = await Transaction.insertMany(transactions);
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