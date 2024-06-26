const {
  NEEM_API_VERSION,
  NEEM_BASE_URL,
  NEEM_MOBILE,
  XNeemPartnerId,
  NEEM_PIN,
} = require("../config");

let BANKS = {
  wallets: [
    {
      bankName: "Easypiasa",
      bankCode: "13",
    },
    {
      bankName: "JazzCash",
      bankCode: "1",
    },
    {
      bankName: "UPaisa",
      bankCode: "14",
    },
  ],
  banks: [
    {
      bankName: "Habib Metro Bank",
      bankCode: "10",
    },
    {
      bankName: "Bank Alfalah",
      bankCode: "24",
    },
    {
      bankName: "Bank Of Punjab",
      bankCode: "22",
    },
  ],
};
const getTokenObject = {
  url: `${NEEM_BASE_URL}/${NEEM_API_VERSION}/oauth2/token`,
  headers: {
    Authorization: "",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: {
    grant_type: "client_credentials",
  },
};

const getClimTokenObject = {
  url: `${NEEM_BASE_URL}/${NEEM_API_VERSION}/neemid/login-pin/${NEEM_MOBILE}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json;charset=utf-8",
    "X-Neem-Partner-Id": `${XNeemPartnerId}`,
    Authorization: "",
  },
  body: {
    Data: {
      Account: {
        MobileNumber: NEEM_MOBILE,
        Pin: NEEM_PIN,
      },
    },
  },
};

module.exports = {
  BANKS,
  getTokenObject,
  getClimTokenObject,
};
