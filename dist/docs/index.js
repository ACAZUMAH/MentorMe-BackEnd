"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MentorMe",
            version: "0.1.0",
            description: "",
            contact: {
                name: "Swagger",
                url: "https://swagger.io",
            },
        },
        servers: [
            {
                url: "https://mentorme-le82.onrender.com",
            },
        ],
    },
    apis: ["dist/docs/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setUpSwagger = async (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.default = setUpSwagger;
// const CSS_URL =
//   "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
// {
//   customCss:
//     ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
//   customCssUrl: CSS_URL,
// }
