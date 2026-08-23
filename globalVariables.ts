import dotenv from "dotenv";
dotenv.config({ path: "./configs/.env", quiet: true });

export const ENV = process.env;
