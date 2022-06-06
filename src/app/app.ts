import express from "express";
import cors from "cors";
import { RANGE_END_PROP, RANGE_START_PROP } from "./shared/constants";
import crypto from "crypto";
import { PaperConfiguration } from '../../../paper-node-configuration/src/app';
import { IEnv } from "../../../paper-node-configuration/src/shared/models/env.interface";

const app: express.Application = express();
const paperConfiguration: PaperConfiguration = new PaperConfiguration(process.env as IEnv, app);
app.disable("x-powered-by");
app.use(cors(paperConfiguration.getCorsOrigin()));

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

paperConfiguration.startNodeServer();
