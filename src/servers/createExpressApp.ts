require('express-async-errors');
require('../services/types');
import express, {Application} from 'express';
import session from 'express-session';
import route from '../routers';
import errorHandler from '../middlewares/error-Handler';
import passport from 'passport';


const createExpressApp = async (): Promise<Application> => {
    const app = express();
    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize());
    app.use(passport.session());    
    app.use(route);
    app.use(errorHandler);

    app.all('*', (_req, res) => {
        return res.json({ message: 'unable to retrieve requested resource' });
    });

    return Promise.resolve(app);
}

export default createExpressApp;