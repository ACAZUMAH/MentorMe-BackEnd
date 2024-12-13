import { Types } from "mongoose";

export interface userType {
    fullName?: string;
    profile_url?: string;
    phone?: string;
    email?: string;
    role?: string;
    programmeOfStudy?: string;
    level?: string;
    about?: string;
    acadamicFields?: string;
    password?: string;
    isAuthenticated?: boolean;
};

export interface authType {
    code: string;
    expiresIn: Date;
};

export interface queryType {
    role?: string;
    fullName?: string | object;
    programmeOfStudy?: string | object;
    level?: string;
    sort?: string;
    page?: number;
    limit?: number;
};

export interface idType {
    menteeId: string | Types.ObjectId;
    mentorId: string | Types.ObjectId;
};

export interface resourceType {
    mentorId?: string | Types.ObjectId;
    resources_url: string;
    forward_to_mentees?: string[];
};

export {

};