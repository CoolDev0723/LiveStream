import dotenv from 'dotenv';

dotenv.config();

export default {
  app_name: process.env.APP_NAME || 'App',
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ANT_URL: process.env.ANT_URL,
  REST_COUNTRIES_URL: "https://restcountries.com/v2", //https://gist.github.com/joshuabaker/d2775b5ada7d1601bcd7b31cb4081981
};
