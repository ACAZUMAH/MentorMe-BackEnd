"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * filter users by role, fullName, programmeOfStudy, level and sort them
 * @param query query object
 * @param model model object
 * @returns filtered users
 */
const filterResult = async (query, model) => {
    const { role, fullName, programmeOfStudy, level, sort } = query;
    const queryObject = { role };
    if (fullName)
        queryObject.fullName = { $regex: fullName, $options: 'i' };
    if (programmeOfStudy)
        queryObject.programmeOfStudy = { $regex: programmeOfStudy, $options: 'i' };
    if (level)
        queryObject.level = level;
    let result = model.find(queryObject);
    if (sort) {
        const sortArray = sort.split(',').join(' ');
        result = result.sort(sortArray);
    }
    else {
        result = result.sort('fullName');
    }
    return result;
};
exports.default = filterResult;
