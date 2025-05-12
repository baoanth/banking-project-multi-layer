const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.status(201).send({ message: "User registered" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { token } = await authService.login(req.body);
    res.send({ token });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

module.exports = { register, login };
