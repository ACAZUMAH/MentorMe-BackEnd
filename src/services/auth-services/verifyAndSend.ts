import { findAuthByCode, findAuthAndUpdate, findAuthByCodeAndDelete } from './index';
import createHttpError from 'http-errors';
import { finduserByIdAndUpdateIsAuth } from '../users-services';
import { generateOTP, generateAccessToken } from '../../helpers';
import { Types } from 'mongoose';
import sendSms from './send-Sms';

/**
 * generate otp and send sms to the user
 * @param id user's id
 * @param phone user's phone number
 * @returns boolean true
 */
export const generateOtpAndSendSms = async (id: string | Types.ObjectId, phone: string) => {
    let otp = await generateOTP(5);
    while(await findAuthByCode(otp)){
        otp = await generateOTP(5);
    };
    const ExpiresIn = new Date(Date.now() + 1 * 60 * 1000);
    await findAuthAndUpdate(id, { code: otp, expiresIn: ExpiresIn });
    const sms = `Your verification code is: ${otp}`;
    //await sendSms(phone, sms);
    return true;
};

/**
 * verify otp code and generate access token
 * @param code otp code
 * @returns access token
 * @throws 400 if otp is invalid
 */
export const verifyOtpAndGenerateToken = async (code: string) => {
    const auth: any = await findAuthByCodeAndDelete(code);
    if(Date.now() > auth.ExpiresIn){
        throw new createHttpError.BadRequest('otp expired');
    };
    await finduserByIdAndUpdateIsAuth(auth.userId);
    return generateAccessToken(auth.userId);
};