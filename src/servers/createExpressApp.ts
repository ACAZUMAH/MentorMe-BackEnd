require('express-async-errors');
import cors from "cors";
import helmet, { HelmetOptions } from "helmet";
import xss from "xss-clean";
import limit from "express-rate-limit";
import express, {Application} from 'express';
import setUpSwagger from '../common/docs';
import { isDevelopment, isProduction, productionWhiteList } from "../common/contants";

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
};

const corsOptions = {
  maxAge: 600,
  credentials: true,
  origin: (origin, callback) => {
    if(!origin){
      callback(null, true);
    } else if(isDevelopment){
      callback(null, true)
    } else if(!isProduction && productionWhiteList.includes(origin)){
      callback(null, true)
    } else {
      callback(new Error("url not allowed!"));
    }
  },
};

const limiter = limit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const createExpressApp = async () => {
    const app = express();

    app.set('trust proxy', 1);

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    app.use(limiter);

    app.use(helmet(helmetOptions));

    app.use(helmet.hidePoweredBy());
    app.disable('x-powered-by');

    app.options('*', cors());
    app.use(cors(corsOptions));

    app.use(xss());

    app.get("/", (_, res) => {
      res.status(200).send("<a href='/api-docs'>docs</a>");
    });

    await setUpSwagger(app);

    return app;
};
