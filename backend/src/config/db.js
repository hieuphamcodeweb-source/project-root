const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is missing. Backend will run without database connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    console.warn("Continue running without MongoDB for local frontend integration.");
  }
};

module.exports = connectDB;