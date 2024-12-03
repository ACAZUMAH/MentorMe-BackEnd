import { Request, Response } from "express";
import * as services from "../services/users-services/index";
import { generateOtpAndSendSms, verifyOtpAndGenerateToken } 
from "../services/auth-services/verifyAndSend";
import { createAuth } from "../services/auth-services/index";
import * as helpers from "../helpers";
import { blacklistToken } from "../services/blacklistedTokens/blacklist";

/**
 * controller for google authentication
 * @param req Request object
 * @param res Response object
 * @returns response message with token
 */
export const googleAuth = async (req: Request, res: Response) => {
    const user:any = req.user;
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    };
    const token = await helpers.generateAccessToken(user.id);
    return res.status(200).json({ success: true, token: token });
};

/**
 * controller to create a new user and send otp
 * @param req Request object
 * @param res Response object
 * @returns response message 
 */
export const createUser = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  await services.checkUserExists(phone);
  const user = await services.createUser({ phone, password });
  const sent = await generateOtpAndSendSms(user._id, phone);
  if (sent) {
    return res.status(201)
      .json({ success: true, message: "User created verify your otp to get authenticated " });
  };
};

/**
 * controller for verifying otp code and generating access token 
 * @param req Request object
 * @param res Response object
 * @returns respose message with token
 */
export const verifyOtp = async (req: Request, res: Response) => {
    const { code } = req.body;
    const token = await verifyOtpAndGenerateToken(code);
    return res.status(200).json({ sucess: true, token: token });
};

/**
 * controller for logging in a user
 * @param req Request object
 * @param res Response object
 * @returns response message with token
 */
export const login = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const user: any = await services.getUserByPhone(phone);
    const match = await helpers.comparePassword(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    };
    const token = await helpers.generateAccessToken(user._id);
    return res.status(200).json({ success: true,  token: token });
};

/**
 * controller for sending otp to user phone number
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const forgotPassword = async (req: Request, res: Response) => {
    const { phone } = req.body;
    const user: any = await services.getUserByPhone(phone);
    await createAuth(user._id);
    const sent = await generateOtpAndSendSms(user._id, phone);
    if (sent) {
        return res.status(200).json({ success: true, message: "OTP sent to your phone number" });
    };
};

/**
 * controller for updating user password
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const newPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const user: any = req.user;
    const hash = await helpers.hashPassword(password);
    await services.findUserByIdAndUpdate(user.id, { password: hash });
    return res.status(200).json({ success: true, message: "Password updated successfully" });
};

/**
 * controller for logging out a user
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const logOut = async (req: Request, res: Response) => {
    const user: any = req.user;
    await services.findUserByIdAndUpdate(user.id, { isAuthenticated: false });
    const token = req.headers.authorization?.split(' ')[1];
    await blacklistToken(token as string);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};