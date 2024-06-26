// const ReqValidation = require('./middlewares/index');
const express = require("express");
const rateLimit = require('express-rate-limit');
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const {  ORIGIN } = require("./config");
const NeemRoute = require("./routes/neem-route");
const serveStatic = require("serve-static");
const { validateApiKey } = require("./middlewares");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP." 
});


class App {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config() {
    this.app.use(cors({ origin: ORIGIN }));
    this.app.use(morgan("combined"));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(limiter);
    this.app.use(serveStatic(path.join(__dirname, "public")));
  }
  
  routes() {
    this.app.get("/", (req, res) => {
      res.send({
        message: "Welcome to Weatherwalay Payment gateway Server",
      });
    });
    
    // this.app.use(`/gateway1`,validateApiKey, NeemRoute); //NEEM
    this.app.use(`/pay`,validateApiKey, NeemRoute); //NEEM
    
    // Unmatched route
    this.app.use("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "error.html"));
    });
  }
}

module.exports = new App().app;
