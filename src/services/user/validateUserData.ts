import Ajv from "ajv";
import addFormat from "ajv-formats";
import createHttpError from "http-errors";
import { createUserInput, updateUserInput } from "../../common/interfaces";


/**
 * validate only the sign up and login in data before creating a user
 * @param data required user data
 */
export const validateAuthData = async (data: createUserInput) => {
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

/**
 * validate user profile data before creating a user profile
 * @param data required user profile data
 */
export const validateProfileData = async (data: updateUserInput) => {
    const ajv = new Ajv();
    addFormat(ajv);

    const schema = {
      type: "object",
      properties: {
        fullName: { type: "string", maxLength: 100 },
        profile_url: { type: "string", format: "uri" },
        email: { type: "string", format: "email" },
        role: { type: "string" },
        programmeOfStudy: { type: "string" },
        level: { type: "string" },
        about: { type: "string", maxLength: 250 },
        acadamicFields: { 
            type: "array", 
            items: { type: "string" } 
        },
      },
    };
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    if (!isValid) {
        const errors = validate.errors?.map(error => {
            return { key: error.instancePath, message: error.message };
        })
        throw new createHttpError.BadRequest(JSON.stringify(errors));
    };
};
