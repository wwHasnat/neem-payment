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
   
async function apiCall(req, res) {
    try {
        console.log("---------------1",req.body);
        const { method, url, body, headers } = req.body;
        
        // Validate if method, url, and headers are provided
        if (!method || !url || !headers) {
            return res.status(400).json({
                success: false,
                msg: "Missing required parameters: method, url, or headers",
                record: null
            });
        }
        
        // Make the API call
        const response = await axios({
            method,
            url,
            data: body,
            headers
        });

        // Send the response back to the client
        res.status(response.status).json({
            success: true,
            msg: "API call successful",
            record: response.data
        });
    } catch (err) {
        // Handle errors
        console.error('API call error:', err.message);
        const statusCode = err.response?.status || 500;
        const statusMessage = err.response?.data?.StatusMessage || "Something went wrong, please try again later";
        res.status(statusCode).json({
            success: false,
            msg: statusMessage,
            record: null
        });
    }
}

module.exports = {
    apiCall
};
