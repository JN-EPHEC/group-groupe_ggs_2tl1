import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GGS API",
      version: "1.0.0",
      description: 'On tente de documenter notre magnifique site'
    },
    servers: [{ url: 'http://localhost:3000' }],  // ← ajoute ça aussi
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }],  // ← déplacé ICI, dans definition
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);