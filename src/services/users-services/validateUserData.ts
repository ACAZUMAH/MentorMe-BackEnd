import Ajv from "ajv";
import addFormat from "ajv-formats";
import { userType } from "../types"; 
import createHttpError from "http-errors";


/**
 * validate only the sign up and login in data before creating a user
 * @param data required user data
 */
export const validateAuthData = async (data: userType) => {
    const ajv = new Ajv();
    addFormat(ajv);
    ajv.addFormat('phone', {
        type: 'string',
        validate: (value: string) => {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            return phoneRegex.test(value);
        }
    });
    const schema = {
        type: 'object',
        properties: {
            phone: { type: 'string', format: 'phone' },
            password: { type: 'string' }
        },
        required: ['phone', 'password']
    };
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
        const errors = validate.errors?.map(error => {
            return { key: error.instancePath, message: error.message };
        });
        throw new createHttpError.BadRequest( JSON.stringify(errors) );
    };
};

export const validateProfileData = async () => {

};