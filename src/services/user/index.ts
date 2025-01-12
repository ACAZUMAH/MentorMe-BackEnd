import {
  createUserInput,
  googleAuthInput,
  updateAuth,
  updatePasswordInput,
  updateUserInput,
  userArrayFilter,
  userDocument,
  userFilter,
} from "../../common/interfaces";
import { userModel } from "../../models";
import createError from "http-errors";
import { Types, FilterQuery, QueryOptions } from "mongoose";
import { validateAuthData, validateProfileData } from "./validateUserData";
import * as helpers from "../../common/helpers";
import * as mentorship from "../mentoship/mentorship";
import * as Mentor from "../mentor/index";
import * as Mentee from "../mentee/index";

/**
 * create a new user in the database with phone and
 * password, then create an auth record
 * @param data required user data
 * @returns saved user
 */
export const createUser = async (data: createUserInput) => {
  await validateAuthData(data);
  const hashedPassword = await helpers.hashPassword(data.password as string);
  const user = await userModel.create({ ...data, password: hashedPassword });
  if (!user) {
    throw new createError.InternalServerError("Could not create user");
  }
  return user;
};

/**
 * create a new user in the database with google data for those signing in with google
 * @param data required user data
 * @returns created user
 * @throws 500 if user could not be created
 */
export const createGoogleUser = async (data: googleAuthInput) => {
  const user = await userModel.create({ ...data });
  if (!user) {
    throw new createError.InternalServerError("Could not create user");
  }
  return user;
};

/**
 * checks if a user already exists with the phone number
 * @param phone user's phone number
 * @throws 409 if user already exists
 */
export const checkUserExists = async (phone: string) => {
  if (await userModel.exists({ phone })) {
    throw new createError.Conflict("User already exists");
  }
};

/**
 * find a user from the database by id
 * @param id user's id
 * @returns found user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const getUserById = async (id: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(id))
    throw new createError.BadRequest("Invalid user id");
  const user = await userModel.findById({ _id: id }, { password: 0, __v: 0 }, null);
  if (!user) throw new createError.NotFound("User not found");
  return user;
};

/**
 * find a user from the database by email
 * @param email user's email
 * @returns found user
 * @throws 404 if no user found with the email
 */
export const findUserByEmail = async (email: string) => {
  return await userModel.findOne({ email });
};

/**
 * get a user by phone number
 * @param phone user phone number
 * @returns user
 */
export const getUserByPhone = async (phone: string) => {
  if (!(await userModel.exists({ phone }))) {
    throw new createError.NotFound("No user found with this phone number");
  }
  const user = await userModel.findOne({ phone });
  if (!user) throw new createError.NotFound("User not found");
  return user;
};

/**
 * find the user by id and update the user's isAuthenticated
 * field to true after verification
 * @param id user's id
 * @returns boolean true
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const updateIsAuthenticated = async ({ id, opt }: updateAuth) => {
  const user = await userModel.findByIdAndUpdate(
    { _id: id },
    { isAuthenticated: opt },
    { new: true, select: "-password" }
  );
  if (!user) throw new Error("Internal server error");
  return user;
};

/**
 * find a user by id and update the user's profile data
 * @param id id of the user
 * @param data data to be updated
 * @returns updated user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const getUserByIdAndUpdate = async (data: updateUserInput) => {
  if (!Types.ObjectId.isValid(data.id)) throw new createError.BadRequest("Invalid user id");
  await validateProfileData(data);
  const user = await userModel.findByIdAndUpdate(
    { _id: data.id },
    { ...data },
    { new: true }
  );
  if (!user) throw new createError.NotFound("No user found with this id");
  return true;
};

/**
 *
 * @param data
 * @returns
 */
export const getUserByIdAndUpdatePassword = async (data: updatePasswordInput) => {
  if (!Types.ObjectId.isValid(data.id)) throw new createError.BadRequest("Invalid user id");

  const user = await userModel.findByIdAndUpdate({ _id: data.id },{ ...data },{ new: true });

  if (!user) throw createError.NotFound("User not found");
  return true;
};

/**
 * find a user by id and delete the user
 * @param id id of the user
 * @returns deleted user
 * @throws 404 if no user found with the id
 * @throws 400 if the id is invalid
 */
export const findUserByIdAndDelete = async (id: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(id)) throw new createError.BadRequest("Invalid user id");
  
  const user = await userModel.findByIdAndDelete({ _id: id });

  if (!user) throw new createError.NotFound("No user found with this id");
  
  if (user.role === "Mentor") {
    await Mentor.deleteMentorData(id);
    await mentorship.deleteAllRequest(id);
  }
  if (user.role === "Mentee") {
    await Mentee.deleteMenteeData(id);
    await mentorship.deleteAllRequest(id);
  }
  return user;
};

/**
 * get all users by role and filter
 *  by fullName, programmeOfStudy, level and sort them
 * @param filter.role - role of he user
 * @param filter.search - search string
 * @param filter.limit - limit number
 * @param filter.page - page number
 * @param filter.sort - sort queries
 * @returns mentees or mentors
 */
export const getMentorsOrMentees = async (filter: userFilter) => {
  const query: FilterQuery<userDocument> = {
    ...(filter.role && { role: filter.role }),
    ...(filter.fullName && { fullName: filter.fullName }),
    ...(filter.programmeOfStudy && {
      programmeOfStudy: filter.programmeOfStudy,
    }),
    ...(filter.level && { level: filter.level }),
    ...(filter.search && {
      $or: [
        { fullName: { $regex: filter.search, $options: "i" } },
        { programmeOfStudy: { $regex: filter.search, $options: "i" } },
        { level: { $regex: filter.search, $options: "i" } },
        { about: { $regex: filter.search, $options: "i" } },
        { acadamicFields: { $regex: filter.search, $options: "i" } },
      ],
    }),
  };

  const limit = helpers.getSanitizeLimit(filter.limit);
  const page = helpers.getSanitizePage(filter.page);
  const skip = helpers.getSanitizeOffset(limit, page);
  const sort = helpers.getSanitizeSort(filter.sort);

  const options: QueryOptions = { skip, lean: true, limit: limit + 1, sort };

  const users = await userModel.find(query, { password: 0, __v: 0 }, options);

  return await helpers.getPageFormat(users, page, limit);
};

/**
 * get mentors of a mentee
 * @param filter.search - search string
 * @param filter.limit - limit number
 * @param filter.page - page number
 * @param filter.sort - sort queries
 * @returns mentors
 */
export const getMyMentors = async (filter: userFilter) => {
  if (!Types.ObjectId.isValid(filter.id!))
    throw new createError.BadRequest("Invalid user id");

  const mentee = await Mentee.getMenteeData(String(filter.id));

  if (!mentee?.mentors) {
    throw new createError.NotFound("You don't have mentors yet");
  }

  const query: FilterQuery<userDocument> = {
    ...({ _id: { $in: mentee.mentors } }),
    ...(filter.fullName && { fullName: filter.fullName }),
    ...(filter.programmeOfStudy && {
      programmeOfStudy: filter.programmeOfStudy,
    }),
    ...(filter.level && { level: filter.level }),
    ...(filter.search && {
      $or: [
        { fullName: { $regex: filter.search, $options: "i" } },
        { programmeOfStudy: { $regex: filter.search, $options: "i" } },
        { level: { $regex: filter.search, $options: "i" } },
        { about: { $regex: filter.search, $options: "i" } },
        { acadamicFields: { $regex: filter.search, $options: "i" } },
      ],
    }),
  };

  const page = helpers.getSanitizePage(filter.page);
  const limit = helpers.getSanitizeLimit(filter.limit);
  const sort = helpers.getSanitizeSort(filter.sort);
  const skip = helpers.getSanitizeOffset(limit, page);

  const options: QueryOptions = { skip, lean: true, limit: limit + 1, sort };

  const mentors = await userModel.find(query, { password: 0, __v: 0 }, options);

  return await helpers.getPageFormat(mentors, page, limit);
};

/**
 * get mentees of a mentor
 * @param filter.search - search string
 * @param filter.limit - limit number
 * @param filter.page - page number
 * @param filter.sort - sort queries
 * @returns mentees
 */
export const getMyMentees = async (filter: userFilter) => {
  if (!Types.ObjectId.isValid(filter.id!)) {
    throw new createError.BadRequest("Invalid user id");
  }
  const data = await Mentor.getMentorData(String(filter.id));
  if (!data?.mentees) {
    throw new createError.NotFound("You don't have mentees yet");
  }

  const query: FilterQuery<userDocument> = {
    ...({ _id: { $in: data.mentees } }),
    ...(filter.fullName && { fullName: filter.fullName }),
    ...(filter.programmeOfStudy && {
      programmeOfStudy: filter.programmeOfStudy
    }),
    ...(filter.level && { level: filter.level }),
    ...(filter.search && {
      $or: [
        { fullName: { $regex: filter.search, $options: "i" } },
        { programmeOfStudy: { $regex: filter.search, $options: "i" } },
        { level: { $regex: filter.search, $options: "i" } },
        { about: { $regex: filter.search, $options: "i" } },
        { acadamicFields: { $regex: filter.search, $options: "i" } },
      ],
    }),
  };

  const page = helpers.getSanitizePage(filter.page);
  const limit = helpers.getSanitizeLimit(filter.limit);
  const sort = helpers.getSanitizeSort(filter.sort);
  const skip = helpers.getSanitizeOffset(limit, page);

  const options : QueryOptions = {skip, lean: true, limit: limit + 1, sort }

  let mentees = await userModel.find(query, { password: 0, __v: 0 }, options);

  return await helpers.getPageFormat(mentees, page, limit);

};

/**
 * combine the mentor and the mentee ids together
 * @param sender sender id
 * @param receiver receiver id
 * @returns return combined ids
 */
export const combineIds = async (sender: string, receiver: string) => {
  const user = await getUserById(sender);
  let combined: any;
  if (user?.role === "Mentor") {
    combined = `${sender}${receiver}`;
  } else {
    combined = `${receiver}${sender}`;
  }
  return combined;
};

/**
 * get mentees or mentors info
 * @param filter.data - array of objects containing mentorIds or menteeIds
 * @param filter.limit - limit number
 * @param filter.page - page number
 * @returns mentors or mentees info
 */
export const getMenteeOrMentorInArray = async (filter: userArrayFilter) => {

  const menteeIds = filter.data.map((doc) => new Types.ObjectId(doc.menteeId!));
  const mentorIds = filter.data.map((doc) => new Types.ObjectId(doc.mentorId!));

  const query = {
    $or: [
      { _id: { $in: menteeIds } },
      { _id: { $in: mentorIds } }
    ]
  }

  const page = helpers.getSanitizePage(filter.page);
  const limit = helpers.getSanitizeLimit(filter.limit);
  const skip = helpers.getSanitizeOffset(limit, page);

  const options: QueryOptions = { skip, lean: true, limit: limit + 1, sort: { createdAt: -1 }}

  const data = await userModel.find(query, { password: 0, __v: 0 }, options);

  return await helpers.getPageFormat(data, page, limit);
}