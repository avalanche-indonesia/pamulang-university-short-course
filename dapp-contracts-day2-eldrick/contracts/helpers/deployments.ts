import dotenv from "dotenv";
dotenv.config();
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY)
export const USER_PRIVATE_KEY = process.env.PRIVATE_KEY || "";