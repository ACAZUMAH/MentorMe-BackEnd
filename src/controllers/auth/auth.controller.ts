import { Request, Response } from "express";
import * as services from "../../services/user/index";
import { createAuth, verifyOtpAndCompleteAuthentication } from "../../services/auth/index";
import * as helpers from "../../common/helpers";
import { blacklistToken } from "../../services/blacklistedTokens/blacklist";
import sendSms from "../../services/messaging/send-sms";
import { isDevelopment } from "../../common/contants";

/**
 * controller for google authentication
 * @param req Request object
 * @param res Response object
 * @returns response message with token
 */
export const googleAuth = async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = helpers.jwtSign(user.id);
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
  const token = await createAuth(user._id, 5);
  await sendSms(phone, token);
  if (isDevelopment) return res.status(201).json({ code: token });
  return res.status(201).json({
    succsss: true,
    message: "User created verify your otp to get authenticated",
  });
};

/**
 * controller for verifying otp code and generating access token
 * @param req Request object
 * @param res Response object
 * @returns respose message with token
 */
export const verifyOtp = async (req: Request, res: Response) => {
  const { code } = req.body;
  const auth = await verifyOtpAndCompleteAuthentication(code);
  return res.status(200).json({ success: true, user: auth.user,  token: auth.token });
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
  }
  if (!user.isAuthenticated) {
    const token = await createAuth(user._id, 5);
    await sendSms(phone, token);
    return res.status(200).json({ success: true, message: "verify the otp send to you" });
  }
  const token = helpers.jwtSign(user._id);
  return res.status(200).json({ success: true, user: user, token: token });
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
  const token = await createAuth(user._id, 5);
  await sendSms(phone, token)
  return res.status(200).json({ success: true, message: "OTP sent to your phone number" });
};

/**
 * controller for updating user password
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const newPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const user: any = req.User;
  const hash = await helpers.hashPassword(password);
  await services.getUserByIdAndUpdatePassword({ id: user._id, password: hash });
  return res.status(200).json({ 
    success: true, 
    message: "Password updated successfully" 
  });
};

/**
 * controller for logging out a user
 * @param req Request object
 * @param res Response object
 * @returns response message
 */
export const logOut = async (req: Request, res: Response) => {
  const user: any = req.User;
  await services.updateIsAuthenticated({ id: user._id, opt: false });
  const token = req.headers['authorization']?.split(" ")[1];
  await blacklistToken(token as string);
  return res.status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
};
