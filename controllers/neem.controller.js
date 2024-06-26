const {
  NEEM_API_VERSION,
  NEEM_BASE_URL,
  NEEM_MOBILE,
  XNeemPartnerId,
  NEEM_PIN,
} = require("../config");
const axios = require("axios");
const { getBearToken } = require("../utils/helper-function");
const { BANKS } = require("../utils/const");


async function getToken() {
  try {
    const body = {
      Data: {
        Account: {
          MobileNumber: NEEM_MOBILE,
          Pin: NEEM_PIN,
        },
      },
    };
    let bearerToken = await getBearToken();
    let response = await axios.post(
      `${NEEM_BASE_URL}/${NEEM_API_VERSION}/neemid/login-pin/${NEEM_MOBILE}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json;charset=utf-8",
          "X-Neem-Partner-Id": `${XNeemPartnerId}`,
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    const { StatusMessage, StatusCode } = response.data.Data.Login;
    if (StatusCode == "N100" && StatusMessage == "Successful") {
      return response.data.Data.Login.LoginClaim;
      // return res.json({
      //   success: true,
      //   token: response.data.Data.Login.LoginClaim,
      // });
    } else {
      return false;
      // return res.status(500).json({
      //   success: false,
      //   msg: "Something went wrong, please try again later",
      // });
    }
  } catch (err) {
    console.log('get Token Error\n',err.response.data);
    return false;
    // const { StatusCode, StatusMessage } = err.response.data;
    // res.status(StatusCode || 500).json({
    //   success: false,
    //   msg: StatusMessage || "Something went wrong, please try again later",
    //   record: null,
    // });
  }
}
class NeemController {
  // async getToken(req, res) {
  // async getToken() {
  //   try {
  //     const body = {
  //       Data: {
  //         Account: {
  //           MobileNumber: NEEM_MOBILE,
  //           Pin: NEEM_PIN,
  //         },
  //       },
  //     };
  //     let bearerToken = await getBearToken();
  //     let response = await axios.post(
  //       `${NEEM_BASE_URL}/${NEEM_API_VERSION}/neemid/login-pin/${NEEM_MOBILE}`,
  //       body,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json;charset=utf-8",
  //           "X-Neem-Partner-Id": `${XNeemPartnerId}`,
  //           Authorization: `Bearer ${bearerToken}`,
  //         },
  //       }
  //     );
  //     const { StatusMessage, StatusCode } = response.data.Data.Login;
  //     if (StatusCode == "N100" && StatusMessage == "Successful") {
  //       return res.json({
  //         success: true,
  //         token: response.data.Data.Login.LoginClaim,
  //       });
  //     } else {
  //       return res.status(500).json({
  //         success: false,
  //         msg: "Something went wrong, please try again later",
  //       });
  //     }
  //   } catch (err) {
  //     const { StatusCode, StatusMessage } = err.response.data;
  //     res.status(StatusCode || 500).json({
  //       success: false,
  //       msg: StatusMessage || "Something went wrong, please try again later",
  //       record: null,
  //     });
  //   }
  // }

  async validateCustomer(req, res) {
    try {

      let bearerToken = await getBearToken();
      const X_Neem_ID = await getToken();
      if (!X_Neem_ID) {
        return res
          .status(500)
          .json({
            success: false,
            msg: "Error while authencate to payment service",
            record: null,
          });
      }
      const response = await axios.post(
        `${NEEM_BASE_URL}/${NEEM_API_VERSION}/neemid/validate-customer/${NEEM_MOBILE}`,
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;charset=utf-8",
            "X-Neem-Partner-Id": `${XNeemPartnerId}`,
            Authorization: `Bearer ${bearerToken}`,
            "X-Neem-Id": X_Neem_ID,
          },
        }
      );
      const { StatusMessage, StatusCode } = response.data.Data;
      if (StatusCode == "N100" && StatusMessage == "Successful") {
        return res.json({
          success: true,
          record: {
            ...response.data.Data,
            X_Neem_ID: X_Neem_ID,
          },
          msg:"customer validate successfully"
        });
      } else {
        let status = 400;
        if (StatusCode.startsWith("B") || StatusCode.startsWith("G")) {
          status = 500;
        }
        return res.status(status).json({
          success: false,
          msg: StatusMessage || "Something went wrong, please try again later",
          record: null,
        });
      }
    } catch (err) {
      console.log("Validate customer Error", err.response?.data);
      // let StatusCode= 500;
      // let StatusMessage="Something went wrong"
      const { StatusCode, StatusMessage } = err.response?.data;
      res.status(StatusCode || 500).json({
        success: false,
        msg: StatusMessage || "Something went wrong, please try again later",
        record: null,
      });
    }
  }

  async initaitePayment(req, res) {
    try {
      let bearerToken = await getBearToken();
      const X_Neem_ID = req.headers["x-neem-id"] || req.headers.X_Neem_ID;
// console.log(req.body);
      const response = await axios.post(
        `${NEEM_BASE_URL}/${NEEM_API_VERSION}/neemid/initiate-payment/${NEEM_MOBILE}`,
        {
          paymentRequest: req.body,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json;charset=utf-8",
            "X-Neem-Partner-Id": `${XNeemPartnerId}`,
            Authorization: `Bearer ${bearerToken}`,
            "X-Neem-Id": X_Neem_ID,
          },
        }
      );
console.log(response.data);
      const { StatusMessage, StatusCode } = response.data?.Data;
      if (StatusCode == "N100" && StatusMessage == "Successful") {
        return res.json({
          success: true,
          record: {
            token: response.data.Data,
          },
          msg:"Payment successfuly"
        });
      } else {
        let status = 400;
        if (StatusCode.startsWith("B") || StatusCode.startsWith("G")) {
          status = 500;
        }
        return res.status(status).json({
          success: false,
          msg: StatusMessage || "Something went wrong, please try again later",
          record: null,
        });
      }
    } catch (err) {
      console.log('Initiate payment error\n',err.response?.data);
      const { StatusCode, StatusMessage } = err.response?.data;
      res.status(StatusCode || 500).json({
        success: false,
        msg: StatusMessage || "Something went wrong, please try again later",
        record: null,
      });
    }
  }

  async getBanks(req, res) {
    try {
      return res
        .status(200)
        .json({ success: true, msg: "bank list", record: BANKS });
    } catch (err) {
      res.status(500).json({
        success: false,
        msg: "Something went wrong, please try again later",
        record: null,
      });
    }
  }
}

module.exports = new NeemController();
