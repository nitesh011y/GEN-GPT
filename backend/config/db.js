import mongoose from "mongoose";

import "dotenv/config";

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected successfully");
  } catch (e) {
    console.log(e);
  }
}

export default main;
