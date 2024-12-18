import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { isTokenBlacklisted } from "../services/blacklistedTokens/blacklist";
import { queryType, resourceQuery } from "../services/types";
import createHttpError from "http-errors";

/**
 *
 * @param password
 * @returns
 */
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * 
 * @param password 
 * @param hash 
 */
export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

/**
 * 
 * @param id 
 * @returns 
 */
export const generateAccessToken = async (id: Types.ObjectId | string) => {
  const payload = { id };
  return jsonwebtoken.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30d" }
  );
};

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const verifyAccessToken = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) {
    throw new createHttpError.Forbidden("Forbidden");
  };
  if(await isTokenBlacklisted(token)) {
    throw new createHttpError.Unauthorized('Unauthorized');
  };
  jsonwebtoken.verify(
    token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if(err) {
      throw new createHttpError.Unauthorized("Unauthorized");
    }
    req.user = user;
    next();
  });
};

/**
 * 
 * @param socket 
 * @param next 
 */
export const verifySocketToken = async (socket: any, next: NextFunction) => {
  const token = socket.handshake.auth?.token; 
  if(!token){
    throw new createHttpError.Forbidden('Forbidden');
  };
  jsonwebtoken.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET as string, 
    (err:any, user:any) =>{

      if(err){
        throw new createHttpError.Unauthorized('Unauthorized');
      };
      socket.user = user;
      next();
    }
  );
};

/**
 * generate a random otp of a given length for verification
 * @param len length of the otp
 * @returns otp code
 */
export const generateOTP = async (len: number) => {
  const digits = "0123456789";
  const Length = digits.length;
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += digits.charAt(Math.floor(Math.random() * Length));
  }
  return otp;
};


/**
 * filter users by role, fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns filtered users
 */
export const filterQuery = async (query: queryType) => {
  const { role, fullName, programmeOfStudy, level } = query;
  const queryObject: Partial<queryType> = {};
  if (role) queryObject.role = role;

  if (fullName) queryObject.fullName = { $regex: fullName, $options: "i" };

  if (programmeOfStudy)
    queryObject.programmeOfStudy = { $regex: programmeOfStudy, $options: "i" };

  if (level) queryObject.level = level;

  return queryObject;
};

/**
 * 
 * @param query 
 * @returns 
 */
export const filterResources = async (query: resourceQuery) => {
  const { title } = query;
  const queryObject: resourceQuery = {};
  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }
  return queryObject;
};