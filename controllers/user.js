const jwt = require("jsonwebtoken");
const { users } = require("../redis");

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  const secret = process.env.JWT_SECRET;
  try {
    await users.isValidUserName(username);
    const token = jwt.sign({ name: username }, secret, {
      expiresIn: 24 * 60 * 60,
    });

    console.log("authorized!!");
    res.status(200).json({ token });
  } catch (err) {
    res.status(err.status || 500).json({ err: err.message });
  }
};

module.exports = {
  login,
};
