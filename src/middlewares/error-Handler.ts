import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

/**
 * catch all errors and return a custom error message
 * @param err error object
 * @param req Request object
 * @param res REsponse object
 * @param next next function
 */
const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    if(err instanceof createHttpError.HttpError){
        res.status(err.statusCode).json({ errors: [{ message: err.message }] });
    }
    res.status(500).json({errors: [{ message: 'Internal Server Error' }]});
};

export default errorHandler; 