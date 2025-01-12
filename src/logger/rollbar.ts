import Rollbar from "rollbar";
import { config } from "dotenv";

config()

export const rollbar = new Rollbar({
  autoInstrument: true,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  enabled: Boolean(process.env.ROLLBAR_ACCESS_TOKEN),
});


