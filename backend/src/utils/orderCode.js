const Order = require("../models/Order");

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

/** 8 ký tự: 4 chữ in hoa + 4 chữ số (ví dụ HHTK1234). */
function randomOrderCode() {
  let code = "";
  for (let i = 0; i < 4; i += 1) {
    code += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  for (let i = 0; i < 4; i += 1) {
    code += DIGITS[Math.floor(Math.random() * DIGITS.length)];
  }
  return code;
}

async function assignUniqueOrderCode(maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const code = randomOrderCode();
    const exists = await Order.exists({ orderCode: code });
    if (!exists) return code;
  }
  throw new Error("Unable to generate a unique order code.");
}

module.exports = { randomOrderCode, assignUniqueOrderCode };
