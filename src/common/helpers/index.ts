import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {  NextFunction, Response } from "express";
import createError from "http-errors";
import { getUserById } from "../../services/user";

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
 * @param obj 
 * @returns 
 */
export const jwtSign = (obj: object) => {
  return jwt.sign(obj, `${process.env.JWT_SECRET}`, { expiresIn: "30d" });
};

export const jwtVerify = (token: string): any => {
  return jwt.verify(token, `${process.env.JWT_SECRET}`)
}

/**
 * 
 * @param socket 
 * @param next 
 */
export const verifySocketToken = async (socket: any, next: NextFunction) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) throw new createError.Forbidden("Forbidden");
    const data = jwtVerify(token);
    if(!data.id) throw new createError.Unauthorized('Unauthorized');
    const user = await getUserById(data.id);
    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

/**
 * generate a random otp of a given length for verification
 * @param len length of the otp
 * @returns otp code
 */
export const generateOTP = (len: number) => {
  const digits = "0123456789";
  const Length = digits.length;
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += digits.charAt(Math.floor(Math.random() * Length));
  }
  return otp;
};

/**
 * sanitize limit query param
 * @param limit limit number
 * @returns sanitized limit
 * @example getSanitizeLimit(10) // 10
 * @example getSanitizeLimit('10') // 10
 * @example getSanitizeLimit(100) // 10
 * @example getSanitizeLimit('') // 10
 */
export const getSanitizeLimit = (limit?: number | string | null) => {
  const limitNumber = Number(limit);
  if(Number.isNaN(limitNumber)) return 10;
  return Math.min(Math.max(limitNumber, 1), 100);
};

/**
 * get sanitize sort array fro sorting 
 * @param sort sort params
 * @returns sanitized sort array
 */
export const getSanitizeSort = (sort?: string | null) => {
  const sortArray = sort?.split(',').join(' ') || ['fullName'];
  return sortArray;
};

/**
 * get sanitized page number for pagenation
 * @param page page number
 * @returns sanitized page number
 */
export const getSanitizePage = (page?: number | string | null) => {
  const pageNumber = Number(page);
  if(Number.isNaN(pageNumber)) return 1;
  return Math.max(pageNumber, 1);
};

/**
 * get sanitize offset for pagination
 * @param limit limit number
 * @param page page number
 * @returns sanitized offset value
 */
export const getSanitizeOffset = (limit: number, page: number) => {
  return (page - 1) * limit;
};

/**
 * 
 * @param data 
 * @param page 
 * @param limit 
 * @returns 
 */
export const getPageFormat = async <T>(data: Array<T>, page: number, limit: number) => {
  const hasNexPage = data.length > limit;
  const edges = hasNexPage ? data.slice(0, limit) : data;
  const pageInfo = { page, limit, total: data.length, hasNexPage };
  return { 
    data: edges,
    info: pageInfo
  };
};

/**
 * 
 * @param data 
 * @param error 
 * @param statusCode 
 * @returns 
 */
export const constructHTTPRespone = (
  data: any = null, 
  error: null | createError.HttpError = null, 
  statusCode: number = 200
) => {
  return (res: Response ) => {

    const response: any = {
      success: !error,
      data: error ? null : data,
      error: error
        ? {
            message: error.message,
            details: error.details || null,
          }
        : null,
    };

    return res.status(statusCode).json(response)
  }
}
