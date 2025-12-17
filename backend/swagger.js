import "dotenv/config";
import swaggerJSDoc from "swagger-jsdoc";

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.SWAGGER_BASE_URL || `http://localhost:${PORT}`;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: process.env.SWAGGER_TITLE || "My API",
      version: process.env.SWAGGER_VERSION || "1.0.0",
      description:
        process.env.SWAGGER_DESCRIPTION ||
        "API documentation generated with swagger-jsdoc + swagger-ui-express",
    },

    servers: [{ url: BASE_URL }],

    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User endpoints" },
      { name: "Favorites", description: "Favorites endpoints" },
      { name: "Reviews", description: "Reviews endpoints" },
      { name: "Profile", description: "Profile endpoints" },
      { name: "Groups", description: "Groups endpoints" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Syötä token muodossa: Bearer <JWT>. Esim: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },

      schemas: {
        Error: {
          type: "object",
          properties: {
            msg: { type: "string", example: "Token puuttuu." },
          },
        },
      },

      responses: {
        UnauthorizedError: {
          description: "Unauthorized (token puuttuu tai ei kelpaa)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
              examples: {
                MissingToken: { value: { msg: "Token puuttuu." } },
                InvalidToken: { value: { msg: "Token ei kelpaa" } },
              },
            },
          },
        },
      },
    },
  },

  // Näistä tiedostoista swagger-jsdoc etsii @swagger -kommentit
  apis: [
    "./routes/**/*.js",
    "./controllers/**/*.js",
    "./models/**/*.js",
    "./middleware/**/*.js", // ok vaikka et dokumentoi täällä, ei haittaa
  ],
});

export default swaggerSpec;
