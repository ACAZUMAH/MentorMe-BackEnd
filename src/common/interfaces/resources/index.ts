import { Types } from "mongoose";

export interface resourceDocument {
    _id: Types.ObjectId
    uploadedBy?: string | Types.ObjectId;
    title: string;
    resources_url: string;
    forward_to_mentees?: string[];
};

export interface resourceFilter {
    page?: number | string | null
    limit?: number | string | null
    uploadedBy?: string | Types.ObjectId
    search?: string | null
    title?: string | null
    menteeId?: string | null
}

export interface resourceInput {
    uploadedBy?: string | Types.ObjectId;
    title: string;
    resources_url: string;
    forward_to_mentees?: string[];
};
