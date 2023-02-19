import dotenv from "dotenv";

dotenv.config();

const {
  SECRET, PORT, OXFORD_APP_ID, OXFORD_APP_KEY,
} = process.env;

const DATABASE_URL = (process.env.NODE_ENV === ("test") || process.env.NODE_ENV === ("development"))
  ? process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL;

export default {
  PORT, DATABASE_URL, SECRET, OXFORD_APP_ID, OXFORD_APP_KEY,
};
