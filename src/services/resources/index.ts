import resources from "../../models/schemas/resources";
import validateResources from "./validate-resources";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { resourceQuery,resourceType } from "../types";
import { filterResources } from "../../helpers/index";

/**
 * upload the resources ref to the database
 * @param data mentorId, resources_ref and share_with_mentees 
 * @returns uploaded resources
 */
export const createResource = async (data: resourceType) => {
    if(data.uploadedBy && !Types.ObjectId.isValid(data.uploadedBy)){
        throw createHttpError.BadRequest('Invalid Mentor id');
    };
    await validateResources(data);
    const upload = await resources.create({ ...data });
    if(!upload){
        throw new createHttpError.InternalServerError('unable to upload resources');
    };

    return upload;
};

/**
 * retrive general uploaded resources to the user
 * @returns uploaded resources
 */
export const getGeneralResources = async (query: resourceQuery) => {
    const { page, limit } = query;
    const queryObject = await filterResources(query)
    let data =  resources.find({
        uploadedBy: { $exists: false },
        forwad_with_mentees: { $exists: false },
        resources_url: { $exists: true, $ne: null},
        ...queryObject
    });
    data = data.sort('createdAt')
    const pages = Number(page) || 1;
    const limits = Number(limit) || 5;
    const skip = (pages - 1) * limits;
    data = data.skip(skip).limit(limits)
    return await data;
};

/**
 * retrive mentors uploaded resources from the database
 * @param mentorId mentor's id
 * @returns found uploaded data
 */
export const getResourcesBymentorId = async (id: string|Types.ObjectId, query: resourceQuery) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest('Invalid mentor id');
    };
    const { page, limit } = query;
    let result = resources.find(
        { uploadedBy: id }, 
        { forward_to_mentees: 0 }
    );
    result = result.sort('createdAt');
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits)
    return await result;
};

/**
 * retrieve forwarded uploaded resources by mentee id
 * @param menteeId mentee's id
 * @returns found uploaded data
 */
export const getforwardedResources = async (id: string|Types.ObjectId, query: any) => {
    if(!Types.ObjectId.isValid(id)){
        throw new createHttpError.BadRequest("Invalid mentee id");
    };
    const { page, limit } = query;
    const queryObject = await filterResources(query);
    let resource = resources.find(
      { forward_to_mentees: id, ...queryObject },
      { forward_to_mentees: 0 }
    );
    resource = resource.sort('createdAt');
    const pages = Number(page) || 1;
    const limits = Number(limit) || 5;
    const skip = (pages - 1) * limits;
    resource = resource.skip(skip).limit(limits);
    return await resource;
};

/**
 * retrieve a list resources from the database with the provided list of ids
 * @param list resource Ids
 * @returns found list of resources
 * @throws 404 if resources are not found
 */
export const findResourcesByIds = async (list: string[]|Types.ObjectId[]) => {
    const resource = await resources.find(
        { _id: { $in: list } },
        { forward_to_mentees: 0 }
    );
    if(!resource){
        throw new createHttpError.NotFound('No resources found');
    };
    return resource;
};

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteUploadResource = async (id: string|Types.ObjectId, mentorId: string) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new createHttpError.BadRequest("Invalid mentor id");
    };
    return await resources.findOneAndDelete({ 
        _id: id,
        uploadedBy: mentorId
    });
};