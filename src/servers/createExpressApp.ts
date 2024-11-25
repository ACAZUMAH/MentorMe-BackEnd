require('express-async-errors');
import express, {Application} from 'express';
import route from '../routers';
import errorHandler from '../middlewares/error-Handler';

const createExpressApp = async (): Promise<Application> => {
    const app = express();
    app.use(express.json());
    app.use(route);
    app.use(errorHandler); 

    app.all('*', (req, res) => {
        res.json({ message: 'unable to retrieve requested resource' });
    });

    return Promise.resolve(app);
}

export default createExpressApp;