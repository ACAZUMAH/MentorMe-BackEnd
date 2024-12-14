import { resourceQuery } from "../types";

const filterResources = async (query: resourceQuery) => {
    const { title } = query;
    const queryObject: resourceQuery = {};
    if(title){
        queryObject.title = { $regex: title, $options: 'i'};
    };
    return queryObject;
};

export default filterResources;