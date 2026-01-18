import dotenv from "dotenv";

dotenv.config();

export const USER_PRIVATE_KEY = process.env.PRIVATE_KEY || "";
