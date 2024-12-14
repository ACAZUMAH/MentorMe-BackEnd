"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadResource = exports.findResourcesByIds = exports.getforwardedResources = exports.getUploadedResourcesBymentorId = exports.getGeneralResources = exports.createResource = void 0;
const resources_1 = __importDefault(require("../../models/schemas/resources"));
const validate_resources_1 = __importDefault(require("./validate-resources"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const resourceFilter_1 = __importDefault(require("../filters/resourceFilter"));
/**
 * upload the resources ref to the database
 * @param data mentorId, resources_ref and share_with_mentees
 * @returns uploaded resources
 */
const createResource = async (data) => {
    if (data.uploadedBy && !mongoose_1.Types.ObjectId.isValid(data.uploadedBy)) {
        throw http_errors_1.default.BadRequest('Invalid Mentor id');
    }
    ;
    await (0, validate_resources_1.default)(data);
    const upload = await resources_1.default.create({ ...data });
    if (!upload) {
        throw new http_errors_1.default.InternalServerError('unable to upload resources');
    }
    ;
    return upload;
};
exports.createResource = createResource;
/**
 * retrive general uploaded resources to the user
 * @returns uploaded resources
 */
const getGeneralResources = async (query) => {
    const { page, limit } = query;
    const queryObject = await (0, resourceFilter_1.default)(query);
    let data = resources_1.default.find({
        uploadedBy: { $exists: false },
        forwad_with_mentees: { $exists: false },
        resources_url: { $exists: true, $ne: null },
        ...queryObject
    });
    data = data.sort('createdAt');
    const pages = Number(page) || 1;
    const limits = Number(limit) || 5;
    const skip = (pages - 1) * limits;
    data = data.skip(skip).limit(limits);
    return await data;
};
exports.getGeneralResources = getGeneralResources;
/**
 * retrive mentors uploaded resources from the database
 * @param mentorId mentor's id
 * @returns found uploaded data
 */
const getUploadedResourcesBymentorId = async (id, query) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest('Invalid mentor id');
    }
    ;
    const { page, limit } = query;
    let result = resources_1.default.find({ uploadedBy: id }, { forward_to_mentees: 0 });
    result = result.sort('createdAt');
    const pages = Number(page) || 1;
    const limits = Number(limit) || 10;
    const skip = (pages - 1) * limits;
    result = result.skip(skip).limit(limits);
    return await result;
};
exports.getUploadedResourcesBymentorId = getUploadedResourcesBymentorId;
/**
 * retrieve forwarded uploaded resources by mentee id
 * @param menteeId mentee's id
 * @returns found uploaded data
 */
const getforwardedResources = async (id, query) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid mentee id");
    }
    ;
    const { page, limit } = query;
    const queryObject = await (0, resourceFilter_1.default)(query);
    let resource = resources_1.default.find({ forward_to_mentees: id, ...queryObject }, { forward_to_mentees: 0 });
    resource = resource.sort('createdAt');
    const pages = Number(page) || 1;
    const limits = Number(limit) || 5;
    const skip = (pages - 1) * limits;
    resource = resource.skip(skip).limit(limits);
    return await resource;
};
exports.getforwardedResources = getforwardedResources;
/**
 * retrieve a list resources from the database with the provided list of ids
 * @param list resource Ids
 * @returns found list of resources
 * @throws 404 if resources are not found
 */
const findResourcesByIds = async (list) => {
    const resource = await resources_1.default.find({ _id: { $in: list } }, { forward_to_mentees: 0 });
    if (!resource) {
        throw new http_errors_1.default.NotFound('No resources found');
    }
    ;
    return resource;
};
exports.findResourcesByIds = findResourcesByIds;
/**
 *
 * @param id
 * @returns
 */
const deleteUploadResource = async (id, mentorId) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new http_errors_1.default.BadRequest("Invalid mentor id");
    }
    ;
    return await resources_1.default.findOneAndDelete({
        _id: id,
        uploadedBy: mentorId
    });
};
exports.deleteUploadResource = deleteUploadResource;
