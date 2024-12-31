import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import limit from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import connectMongo from 'connect-mongodb-session';
import { Application } from "express";

const whiteList = ["https://mentor-me-one.vercel.app", `http://localhost:${process.env.PORT}`];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: any, allowed?: boolean) => void) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("url not allowed!"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const limiter = limit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

/**
 * apply all meddlewre to the epress to the server
 * @param app the express app
 * @returns the app after applying all middlewares
 */
const applyMiddlewares = async(app: Application) => {
    const mongoStore = connectMongo(session);

    const store = new mongoStore({
        uri: process.env.DATABASE_URL,
        collection: 'sessions'
    });

    store.on('error', (err: any) => console.log(err));

    app.use(
        session({
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: false,
            store: store
        })
    );

    app.use(passport.initialize());

    app.use(passport.session()); 

    app.use(cors(corsOptions));

    app.use(helmet());

    app.use(xss());

    app.use(limiter);

    return app;

};

export default applyMiddlewares;