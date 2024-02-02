const jwt = require("jsonwebtoken");
const secret_key = "meow"; // my .env doesn't work
function getToken(id) {
  return jwt.sign({ id }, secret_key, { expiresIn: "20d" });
}

module.exports = getToken;
