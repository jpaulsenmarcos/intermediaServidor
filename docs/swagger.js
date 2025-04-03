const swaggerJsdoc = require("swagger-jsdoc")
const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Tracks - Express API with Swagger (OpenAPI 3.0)",
            version: "0.1.0",
            description:
                "This is a CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "u-tad",
                url: "https://u-tad.com",
                email: "ricardo.palacios@u-tad.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            schemas: {
                registerAuth: {
                    type: "object",
                    required: ["mail", "passwd"],
                    properties: {
                        mail: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        password: {
                            type: "string"
                        },
                    }
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};
module.exports = swaggerJsdoc(options)