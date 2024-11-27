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
};

export interface authType {
    code: string;
    expiresIn: Date
};

export {
    
};