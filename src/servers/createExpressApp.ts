require('express-async-errors');
require('../services/types');
import express, {Application} from 'express';
import setUpSwagger from '../docs';

const createExpressApp = async (): Promise<Application> => {
    const app = express();

    app.set('trust proxy', 1);

    app.use(express.json());

    app.get("/", (_req, res) => {
      res.status(200).send("<a href='/api-docs'>docs</a>");
    });

    await setUpSwagger(app);

    return Promise.resolve(app);
}

export default createExpressApp;