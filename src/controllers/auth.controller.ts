import { Request, Response } from "express";
import * as services from "../services/users-services/index";
import { 
    generateOtpAndSendSms, 
    verifyOtpAndGenerateToken 
} from "../services/auth-services/verifyAndSend";
import { comparePassword, generateAccessToken } from "../helpers";

/**
 * controller to create a new user and send otp
 * @param req Request object
 * @param res Response object
 * @returns response message 
 */
export const createuser = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  await services.checkUserExists(phone);
  const user = await services.createUser({ phone, password });
  const sent = await generateOtpAndSendSms(user._id, phone);
  if (sent) {
    return res.status(201)
      .json({ message: "User created verify your otp to get authenticated " });
  };
};

/**
 * controller for verifying otp code and generating access token 
 * @param req Request object
 * @param res Response object
 */
export const verifyOtp = async (req: Request, res: Response) => {
    const { code } = req.body;
    const token = await verifyOtpAndGenerateToken(code);
    return res.status(200).json({ token });
};

/**
 * controller for logging in a user
 * @param req Request object
 * @param res Response object
 */
export const login = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const user: any = await services.getUserByPhone(phone);
    const match = await comparePassword(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
    };
    const token = await generateAccessToken(user._id);
    return res.status(200).json({ token: token });
};