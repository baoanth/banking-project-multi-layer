const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id: String,
  date: String,
  object: String,
  amount: Number,
});

const accountSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: false, select: false },
  currency: { type: String, required: true },
  description: String,
  balance: Number,
  transactions: [transactionSchema],
});

accountSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;