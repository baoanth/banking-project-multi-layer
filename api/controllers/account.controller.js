const service = require("../services/account.service");

exports.create = async (req, res) => {
  try {
    const acc = await service.createAccount(req.body);
    res.status(201).json(acc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  const acc = await service.getAccount(req.params.user);
  if (!acc) return res.status(404).json({ error: "User not found" });
  res.json(acc);
};

exports.delete = async (req, res) => {
  const result = await service.deleteAccount(req.params.user);
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.sendStatus(204);
};

exports.addTransaction = async (req, res) => {
  try {
    const tx = await service.addTransaction(req.params.user, req.body);
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await service.deleteTransaction(req.params.user, req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};