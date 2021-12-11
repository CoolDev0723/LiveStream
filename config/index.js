import dotenv from 'dotenv';

dotenv.config();

export default {
  app_name: process.env.APP_NAME || 'App',
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ANT_URL: process.env.ANT_URL,
};
