"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * filter users by role, fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @returns filtered users
 */
const filterQuery = async (query) => {
    const { role, fullName, programmeOfStudy, level } = query;
    const queryObject = {};
    if (role)
        queryObject.role = role;
    if (fullName)
        queryObject.fullName = { $regex: fullName, $options: 'i' };
    if (programmeOfStudy)
        queryObject.programmeOfStudy =
            { $regex: programmeOfStudy, $options: 'i' };
    if (level)
        queryObject.level = level;
    return queryObject;
};
exports.default = filterQuery;
