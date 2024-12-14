"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterResources = async (query) => {
    const { title } = query;
    const queryObject = {};
    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }
    ;
    return queryObject;
};
exports.default = filterResources;
