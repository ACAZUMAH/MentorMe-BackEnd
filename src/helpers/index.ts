import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { Types } from "mongoose";

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
    { expiresIn: "50d", }
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
