import { resourceModel } from "../../models";
import { FilterQuery, QueryOptions, Types } from "mongoose";
import validateResources from "./validate-resources";
import createError from "http-errors";
import { resourceDocument, resourceInput, resourceFilter } from "../../common/interfaces/resources";
import * as helpers from '../../common/helpers/index';

/**
 * upload the resources ref to the database
 * @param data mentorId, resources_ref and share_with_mentees 
 * @returns uploaded resources
 */
export const createResource = async (data: resourceInput) => {
    if(data.uploadedBy && !Types.ObjectId.isValid(data.uploadedBy)){
        throw createError.BadRequest('Invalid Mentor id');
    };
    await validateResources(data);
    const upload = await resourceModel.create({ ...data });

    if(!upload) throw new createError.InternalServerError('unable to upload resources');

    return upload;
};

/**
 * retrive general uploaded resources to the user
 * @returns uploaded resources
 */
export const getGeneralResources = async (filter: resourceFilter) => {
    const query: FilterQuery<resourceDocument> = {
        ...({ uploadedBy: { $exists: false } }),
        ...({ forwad_with_mentees: { $exists: false } }),
        ...({ resources_url: { $exists: true, $ne: null } }),
        ...(filter.title && { title: filter.title }),
        ...(filter.search && {
            $or: [
                { title: { $regex: filter.search, $options: 'i' } }
            ]
        })
    };

    const page = helpers.getSanitizePage(filter.page);
    const limit = helpers.getSanitizeLimit(filter.limit);
    const skip = helpers.getSanitizeOffset(limit, page);

    const options: QueryOptions = { skip, lean: true, limit : limit + 1, sort: { createdAt: -1 }}

    let data =  await resourceModel.find(query, null, options);

    return await helpers.getPageFormat(data, page, limit)
};

/**
 * get mentors uploaded resources
 * @param filter.mentorId mentor's id
 * @returns found uploaded data
 */
export const getResourcesBymentorId = async (filter: resourceFilter) => {
    if(!Types.ObjectId.isValid(filter.uploadedBy!)){
        throw new createError.BadRequest('Invalid mentor id');
    };
    const query: FilterQuery<resourceDocument> = {
        ...({ uploadedBy: filter.uploadedBy! }),
        ...(filter.title && { title: filter.title }),
        ...(filter.search && {
            $or: [{ title: { $regex: filter.search, $options: 'i' } }]
        })
    }
    const page = helpers.getSanitizePage(filter.page);
    const limit = helpers.getSanitizeLimit(filter.limit);
    const skip = helpers.getSanitizeOffset(limit, page);

    const options : QueryOptions = {
        skip,
        limit: limit + 1,
        sort: { createdAt: -1 }
    }

    let result = await resourceModel.find( query, { forward_to_mentees: 0 }, options);

    return await helpers.getPageFormat(result, page, limit);
};

/**
 * get forwarded uploaded resources by mentee id
 * @param menteeId mentee's id
 * @returns found uploaded data
 */
export const getforwardedResources = async (filter: resourceFilter) => {
    if(!Types.ObjectId.isValid(filter.menteeId!)) throw new createError.BadRequest("Invalid mentee id");
    const query: FilterQuery<resourceDocument> = {
        ...({ forward_to_mentees: filter.menteeId }),
        ...(filter.title && { title: filter.title }),
        ...(filter.search && { 
            $or: [{ title: { $regex: filter.search, $options: 'i' } }]
        })
    }

    const page = helpers.getSanitizePage(filter.page);
    const limit = helpers.getSanitizeLimit(filter.limit);
    const skip = helpers.getSanitizeOffset(page, limit)

    const options: QueryOptions = {
        skip,
        limit: limit + 1,
        sort: { createdAt: -1 }
    }

    let resource = await resourceModel.find(query, { forward_to_mentees: 0 }, options);

    return await helpers.getPageFormat(resource, page, limit)
};

/**
 * retrieve a list resources from the database with the provided list of ids
 * @param list resource Ids
 * @returns found list of resources
 * @throws 404 if resources are not found
 */
export const findResourcesByIds = async (list: string[] | Types.ObjectId[]) => {
    const resource = await resourceModel.find({ _id: { $in: list } },{ forward_to_mentees: 0 });
    if(!resource) throw new createError.NotFound('No resources found');
    return resource;
};

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteUploadResource = async (id: string|Types.ObjectId, mentorId: string) => {
    if (!Types.ObjectId.isValid(id)) throw new createError.BadRequest("Invalid mentor id");
    const deleted = await resourceModel.findOneAndDelete({  _id: id, uploadedBy: mentorId });
    if (!deleted) throw new createError.NotFound("Resources not found");
        
};