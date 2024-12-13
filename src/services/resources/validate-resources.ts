import Ajv from 'ajv';
import createHttpError from 'http-errors';

const validateResources = async (data: any) => {
    const ajv = new Ajv();

    const schema = {
        type: 'object',
        properties: {
            mentorId: { type: 'string' },
            title: { type: 'string' },
            resources_url: { type: 'string' },
            forward_to_mentees: { type: 'array', items: { type: 'string' } }
        },
        required: ['resources_url']
    };

    const validate = ajv.compile(schema);

    const isValid = validate(data);

    if(!isValid){
        const errors = validate.errors?.map(error => {
            return { key: error.instancePath, message: error.message };
        });
        throw new createHttpError.BadRequest(JSON.stringify(errors));
    }; 
};

export default validateResources;