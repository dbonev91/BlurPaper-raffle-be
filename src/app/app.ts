import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import { RANGE_END_PROP, RANGE_START_PROP } from "./shared/constants";
import crypto from "crypto";

const app: express.Application = express();
app.disable("x-powered-by");
const corsOptions: cors.CorsOptions = {
  origin: [
    `http://raffle.${process.env.BLURPAPER_ORIGIN}`,
    `http://www.raffle.${process.env.BLURPAPER_ORIGIN}`,
    `https://raffle.${process.env.BLURPAPER_ORIGIN}`,
    `https://www.raffle.${process.env.BLURPAPER_ORIGIN}`,
  ],
};
app.use(cors(corsOptions));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get(
  `/get-rand-number-in-range/:${RANGE_END_PROP}/:${RANGE_START_PROP}`,
  (request: express.Request, response: express.Response) => {
    let start: number = Number(request.params[RANGE_START_PROP]);

    if (isNaN(start)) {
      start = 0;
    }

    let end: number = Number(request.params[RANGE_END_PROP]);

    if (isNaN(end)) {
      return response.status(400).json({
        status: "error",
        message: "Please provide an integer value for the end of the range",
      });
    }

    const randomInt: number = crypto.randomInt(start, end);

    return response.status(200).json({
      status: "success",
      randomInt,
    });
  }
);

let server: https.Server | express.Application = app;

if (
  process.env.BLURPAPER_MONGO_SSL_PATH &&
  process.env.BLURPAPER_MONGO_SSL_PATH !== "undefined"
) {
  server = https.createServer(
    {
      key: fs.readFileSync("/etc/ssl/private/ZeroSSL/private.key"),
      cert: fs.readFileSync("/etc/ssl/ZeroSSL/certificate.crt"),
      rejectUnauthorized: false,
    },
    app
  );
}

server.listen(3009, () => {
  console.log("Raffle app is listening on port 3009!!!!");
});
