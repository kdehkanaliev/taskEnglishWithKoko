import swaggerJsdoc from "swagger-jsdoc";
import env from "dotenv";
env.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "Trello-like backend API",
    },

    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],

    tags: [
      { name: "Users" },
      { name: "Workspaces" },
      { name: "Boards" },
      { name: "Tasks" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
