import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Application } from "express";

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
        url: "https://mentor-me-one.vercel.app/",
      },
    ],
  },
  apis: ["dist/routers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";


const setUpSwagger = async (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss:
        ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
      customCssUrl: CSS_URL,
    })
  );
};

export default setUpSwagger;

