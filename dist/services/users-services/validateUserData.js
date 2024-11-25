"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfileData = exports.validateAuthData = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * validate only the sign up and login in data before creating a user
 * @param data required user data
 */
const validateAuthData = async (data) => {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat('phone', {
        type: 'string',
        validate: (value) => {
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
        throw new http_errors_1.default.BadRequest(JSON.stringify(errors));
    }
    ;
};
exports.validateAuthData = validateAuthData;
const validateProfileData = async () => {
};
exports.validateProfileData = validateProfileData;
