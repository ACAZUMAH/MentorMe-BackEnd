import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { jwtVerify } from "../common/helpers";
import { getUserById } from "../services/user/index";
import { isTokenBlacklisted } from "../services/blacklistedTokens/blacklist";
import { logger } from "../logger";
/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const verifyToken = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const bearerHeader = req.headers['authorization'];

        if(!bearerHeader)throw new createError.Forbidden('Forbidden');
      
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer.length > 1 ? bearer[1] : bearer[0];

        if( await isTokenBlacklisted(bearerToken)) 
            throw new createError.Unauthorized("Unauthorized");
        if(!bearerToken) throw new createError.Unauthorized('Unauthorized');

        const data = jwtVerify(bearerToken);
        if(!data?.id) throw new createError.Unauthorized("Unauthorized");

        const user = await getUserById(data.id);

        req.User = user;
        
        return next();
    } catch (error) {
        logger.error(error);
        process.exit(1)
    }
};