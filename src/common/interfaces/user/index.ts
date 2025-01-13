import { Types } from "mongoose";

export interface userDocument {
  _id: Types.ObjectId
  fullName?: string | null
  profile_url?: string | null
  phone: string
  email?: string | null
  role?: string | null
  programmeOfStudy?: string | null
  level?: string | null
  about?: string | null
  acadamicFields?: string[] | null
  password: string
  isAuthenticated: boolean
}

export interface createUserInput {
  phone: string,
  password: string
}

export interface googleAuthInput {
  fullName: string 
  email: string 
  profile_url: string
}

export interface updateUserInput {
  id: string
  fullName: string;
  profile_url: string;
  phone: string;
  email: string;
  role: string;
  programmeOfStudy: string;
  level: string;
  about: string;
  acadamicFields: string;
}

export interface updateAuth {
  id: string | Types.ObjectId
  opt: boolean
}

export interface updatePasswordInput {
  id: string
  password: string
}

export interface userFilter {
  id?: string | Types.ObjectId | null;
  page?: number | null;
  limit?: number | null;
  sort?: string | null;
  role?: string | null;
  search?: string | null;
  fullName?: string | null;
  programmeOfStudy?: string | null;
  level?: string | null;
}
