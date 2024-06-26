const {
  NEEM_API_VERSION,
  NEEM_BASE_URL,
  client_id,
  client_secret,
} = require("../config");
const combinedString = `${client_id}:${client_secret}`;
const axios = require("axios");

async function getBearToken() {
  try {
    const base64Token = Buffer.from(combinedString).toString("base64");
    const tokenPromise = await axios.post(
      `${NEEM_BASE_URL}/${NEEM_API_VERSION}/oauth2/token`,
      {
        grant_type: "client_credentials",
      },
      {
        headers: {
          Authorization: `basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return tokenPromise.data.access_token;
  } catch (error) {
    console.log("Error while getting BearToken\n", error.response?.data);
  }
}

module.exports = {
  getBearToken,
};
