import Ajv from 'ajv';
import { messageType } from '../../types';
import createHttpError from 'http-errors';

/**
 * 
 * @param data 
 * @returns 
 */
const validateMessageData = async (data: messageType) => {
    const ajv = new Ajv();

    const schema = {
        type: 'object',
        properties: {
            messagesIds: { type: 'string' },
            senderId: { type: 'string' },
            message: { type: 'string', maxLength: 250}
        },
        required: ['messagesIds', 'senderId', 'message']
    };

    const validate  = ajv.compile(schema);

    const isValid = validate(data);

    if(!isValid){
        const errors = validate.errors?.map(error => {
            return { key: error.instancePath, message: error.message };
        });
        throw new createHttpError.BadRequest(JSON.stringify(errors));
    };
    return true;
};

export default validateMessageData;