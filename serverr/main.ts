import { CallbackError } from "mongoose";
import { Server } from "./server";
import mongoose from "./utils/database";
import { MONGO_DB_URL } from "./utils/secrets";

function main() {
  const server = new Server();
  mongoose.connect(MONGO_DB_URL, (error: CallbackError) => {
    if (error) throw error;
    console.log(`MongoDB Connection has been established with ${MONGO_DB_URL}`);
  });
  server.run();
}

main();
