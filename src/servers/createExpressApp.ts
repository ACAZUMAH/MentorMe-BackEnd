require('express-async-errors');
require('../services/types');
import express, {Application} from 'express';
import session from 'express-session';
import route from '../routers';
import errorHandler from '../middlewares/error-Handler';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import limit from 'express-rate-limit';
import passport from 'passport';
import setUpSwagger from '../docs';
import client from '../models/connect/redis';
import connectRedis from 'connect-redis';

const createExpressApp = async (): Promise<Application> => {
    const redisStore = connectRedis(session)
    const limiter = limit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
    const app = express();
    app.set('trust proxy', 1);
    app.use(express.json());
    app.use(session({
        store: new redisStore({ client: client }),
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false 
    }));
    app.use(passport.initialize());
    app.use(passport.session()); 
    app.use(limiter); 
    app.use(cors());
    app.use(helmet());
    app.use(xss());
    app.use(route);
    await setUpSwagger(app);
    app.use(errorHandler);
    app.all('*', (_req, res) => {
        return res.json({ message: 'unable to retrieve requested resource' });
    });
    return Promise.resolve(app);
}

export default createExpressApp;