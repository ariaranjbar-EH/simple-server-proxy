import bodyParser from "body-parser";
import express from "express";
import http from "http";
import targetServerRoutes from "./routes/target_server_routes";
import { logger } from "./services/logger";
import crypto from "crypto";
import { server_root_address } from "./services/mappers";

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  // Use dev dependency
  dotenv.config();
}

const router = express();

const basic_auth_tokens = process.env.SERVER_BASIC_AUTH_TOKENS?.split(';');

router.use(async (req, res, next) => {
  const req_id = crypto.randomUUID();
  logger.info(
    `REQUEST - [${req_id}], METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
  );
  res.on("finish", () => {
    logger.info(
      `REQUEST - [${req_id}] finished with STATUS - [${res.statusCode}]`
    );
  });
  next();
});

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  const auth_header = req.headers['authorization'] || req.headers['Authorization'] || '';
  const auth: string = Array.isArray(auth_header)?auth_header[auth_header.length - 1]:auth_header

  if (req.method == "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, DELETE, POST, PUT, OPTIONS"
    );
    res.send(200);
    next();
  }
  else if (auth){
    const [auth_type, auth_token] = auth.split(' ')
    if (auth_type == 'Basic' && auth_token && basic_auth_tokens?.find(item => item == auth_token))
      {
        next()
      }
  }
  return res.status(401).json({
    message: 'Unauthorized',
  });
});

// Routes
router.use("/" + process.env.SERVER_API_VERSION, targetServerRoutes);

// Error Handling
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

// Server
const httpServer = http.createServer(router);
httpServer.listen(process.env.PORT, () => {
  logger.info(
    `Server running on ${process.env.SERVER_URL}:${process.env.PORT}`
  );
  logger.info(`Use [ ${server_root_address()}/passthrough/ ] as your base url`);
});
