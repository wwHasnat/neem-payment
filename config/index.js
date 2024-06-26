const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const {
  PORT,
  ORIGIN,
  api_key,
  client_id,
  client_secret,
  NEEM_BASE_URL,
  NEEM_API_VERSION,
  NEEM_MOBILE,
  XNeemPartnerId,
  NEEM_PIN,BACIC_TOKEN
} = process.env;

module.exports = {
  PORT,
  ORIGIN,
  api_key,
  client_id,
  client_secret,
  NEEM_BASE_URL,
  NEEM_API_VERSION,
  NEEM_MOBILE,
  XNeemPartnerId,
  NEEM_PIN,BACIC_TOKEN
};

