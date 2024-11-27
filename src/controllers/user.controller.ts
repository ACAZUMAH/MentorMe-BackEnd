import { Request, Response } from "express";
import * as services from "../services/users-services/index";
import { checkTokenIsValid } from "../helpers"

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
            .json({ message: "User created  verify your otp to get authenticated " });
    };
};

/*************  ✨ Codeium Command 🌟  *************/
// Controller function to create a user profile
/**
 * Create a user profile
 * 
 * @param req Request object
 * @param res Response object
 * 
 * @returns response message
 */
export const createprofile = async (req: Request, res: Response) => {
    // Extract user profile data from the request body
    const {
        fullName,
        profile_url,
        email,
        role,
        programmeOfStudy,
        level,
        about,
        acadamicFields
    } = req.body;

    // Construct a user data object
    const userdata = { fullName, profile_url, email, role, programmeOfStudy, level, about, acadamicFields };

    // Retrieve the authorization token from request headers
    const token = req.headers.authorization;
    console.log(token);

    // Validate the token and get the associated user ID
    const userId = await checkTokenIsValid(token as string);

    // If token is invalid, return an unauthorized error response
    if (!userId) {
        return res.status(401).json({ message: "Invalid token" });
    }

    // Create or update the user profile in the database
    const userprofile = await services.findUserByIdAndCreateProfile(userId, userdata);

    // Respond with the created or updated user profile
    if (!userprofile) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({ userprofile });
};

/******  a0b5e8fe-5a88-421e-9415-a4845696ae51  *******/