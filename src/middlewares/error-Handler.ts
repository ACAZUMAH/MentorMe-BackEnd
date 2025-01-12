import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { logger, rollbar } from '../logger';
import { constructHTTPRespone } from "../common/helpers";

/**
 * catch all errors and return a custom error message
 * @param err error object
 * @param req Request object
 * @param res REsponse object
 * @param next next function
 */
const errorHandler = async (err:any, req:Request, res:Response, next:NextFunction) => {
    rollbar.log(err);
    logger.error(err);
    if(err instanceof createError.HttpError){
        return constructHTTPRespone(null, err, err.status)(res)
    }
    return constructHTTPRespone(null, createError(500, 'Server Error'), 500)(res)
};

export default errorHandler; 