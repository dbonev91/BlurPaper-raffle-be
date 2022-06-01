import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import { RANGE_END_PROP, RANGE_START_PROP } from "./shared/constants";
import crypto from "crypto";
import { config } from 'dotenv';

const path: string | undefined = `./environment/${process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'}`;

config({ path });

// TODO: export as generic function in common repo for all the microservices: https://dbpaper.atlassian.net/browse/SM-1
const MAIN_CORS_URL: string = `${process.env.CORS_PROTOCOL}://${process.env.CORS_DOMAIN}`;
const origin: string[] = process.env.CORS_PORTS ? process.env.CORS_PORTS.split(' ').map((port: string) => {
  return `${MAIN_CORS_URL}:${port.trim()}`;
}) : [];

origin.push('https://raffle.blurpaper.com');
origin.push('https://www.raffle.blurpaper.com');
origin.push(MAIN_CORS_URL);

const app: express.Application = express();
app.disable("x-powered-by");
const corsOptions: cors.CorsOptions = { origin };
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

// TODO: export as generic function in common repo for all the microservices: https://dbpaper.atlassian.net/browse/SM-1
if (process.env.SSL_KEY && process.env.SSL_CERT) {
  try {
    server = https.createServer(
      {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
        rejectUnauthorized: false,
      },
      app
    );
  } catch (error) {
    console.log('ERROR:');
    console.log('Could not start with SSL connection');
    console.log(error);
  }
}

server.listen(process.env.PORT, () => {
  console.log(`Paper raffle app is listening on port ${process.env.PORT}!!!!`);
});
