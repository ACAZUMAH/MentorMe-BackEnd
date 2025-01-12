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
  const token = helpers.jwtSign({ id: user.id });
  return helpers.constructHTTPRespone(token)(res);
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
  if (isDevelopment) return helpers.constructHTTPRespone(token, null, 201)(res)
  await sendSms(phone, token);
  return helpers.constructHTTPRespone(
    { message: "User created verify your otp to get authenticated" },
    null,
    201
  )(res);
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
  return helpers.constructHTTPRespone({ user: auth.user, token: auth.token })(res);
};

/**
 * controller for logging in a user
 * @param req Request object
 * @param res Response object
 * @returns response message with token
 */
export const login = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const auth: any = await services.getUserByPhone(phone);
  const match = await helpers.comparePassword(password, auth.password);
  if (!match) {
    return helpers.constructHTTPRespone({ message: "Invalid credentials" }, null, 401)(res);
  }
  if (!auth.isAuthenticated) {
    const token = await createAuth(auth._id, 5);
    await sendSms(phone, token);
    return helpers.constructHTTPRespone( { message: "verify the otp send to you" })(res)
  }
  const user = await services.getUserById(auth._id);
  const token = helpers.jwtSign({ id: user._id });
  return helpers.constructHTTPRespone({ user: user, token: token })(res);
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
  if(isDevelopment) return helpers.constructHTTPRespone({ code: token })(res);
  await sendSms(phone, token)
  return helpers.constructHTTPRespone({ message: "OTP sent to your phone number" })(res);
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
  return helpers.constructHTTPRespone({ message: "Password updated successfully" })(res);
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
  return helpers.constructHTTPRespone({ message: "Logged out successfully" })(res);
};
