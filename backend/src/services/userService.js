const mongoose = require("mongoose");
const User = require("../models/User");

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

async function getNextUserId() {
  const latestUser = await User.findOne().sort({ id: -1 }).lean();
  return latestUser ? latestUser.id + 1 : 1;
}

module.exports = {
  User,
  isDbConnected,
  getNextUserId,
};
