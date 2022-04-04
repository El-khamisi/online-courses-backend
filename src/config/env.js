require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  DBURI: process.env.DBURI,
  DBURI_remote: process.env.DBURI_remote,
  TOKENKEY: process.env.TOKENWORD,

  cloudinary_name: process.env.cloudinary_name,
  cloudinary_api_key: process.env.cloudinary_api_key,
  cloudinary_api_secret: process.env.cloudinary_api_secret,
  NODE_ENV: process.env.NODE_ENV,
};
