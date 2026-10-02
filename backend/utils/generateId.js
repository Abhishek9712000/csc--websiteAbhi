const crypto = require("crypto");

function generateApplicationId() {
  // 6-digit unique number: 100000 to 999999
  const num = crypto.randomInt(100000, 1000000);
  return String(num);
}

module.exports = { generateApplicationId };