import { Types } from "mongoose";
import { authModel } from "../../models";
import createError from 'http-errors';
import { generateOTP, jwtSign } from "../../common/helpers";
import { getUserById, updateIsAuthenticated } from "../user";

export const createAuth = async (userId: Types.ObjectId, len: number) => {
    let token = generateOTP(len);

    while(await authModel.exists({ token })){
        token = generateOTP(len);
    };

    const expiresIn = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await authModel.findOneAndUpdate({ userId }, { userId, token, expiresIn }, { upsert: true })

    return token;
};

export const verifyOtpAndCompleteAuthentication = async (token: string) => {
    const auth = await authModel.findOneAndDelete({ token });

    if(!auth) throw new createError.BadRequest('Invalid otp');

    if(new Date(auth.expiresIn) < new Date()) throw new createError.BadRequest('otp expired');

    const user = await getUserById(String(auth.userId));

    await updateIsAuthenticated({ id: user._id, opt: true });

    const authToken = jwtSign({ id: user._id });

    return { user, token };
}