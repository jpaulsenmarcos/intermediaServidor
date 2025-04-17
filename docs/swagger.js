const swaggerJsdoc = require("swagger-jsdoc");
const { onBoardingCompany, inviteUser } = require("../controllers/users");
const { verificationCtrl } = require("../controllers/verify");
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
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer"
                },
            },
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
                login: {
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
                passChange: {
                    type: "object",
                    required: ["verifyCode", "newPasswd"],
                    properties: {
                        verifyCode: {
                            type: "string",
                            example: "000000"
                        },
                        newPasswd: {
                            type: "string"
                        }
                    }
                },
                resgiterUser: {
                    type: "object",
                    required: ["mail", "name", "surnames", "nif"],
                    properties: {
                        mail: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        name: {
                            type: "string",
                            example: "Pepe"
                        },
                        surnames: {
                            type: "string",
                            example: "Uriol Hernan"
                        },
                        nif: {
                            type: "string",
                            example: "40000009P"
                        }
                    }
                },
                onBoardingCompany: {
                    type: "object",
                    required: ["company"],
                    properties: {
                        company: {
                            type: "object",
                            required: ["name", "cif", "street", "number", "postal", "city", "province"],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Pepe"
                                },
                                cif: {
                                    type: "string",
                                    example: "BXXXXXXXX"
                                },
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "number",
                                    example: 22
                                },
                                postal: {
                                    type: "number",
                                    example: 28002
                                },
                                city: {
                                    type: "string",
                                    example: "Madrid"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                },
                            },
                        },
                    }
                },
                inviteUser: {
                    type: "object",
                    required: ["mail", "passwd", "name", "surnames", "nif"],
                    properties: {
                        mail: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        passwd: {
                            type: "string",
                        },
                        name: {
                            type: "string",
                            example: "Pepe"
                        },
                        surnames: {
                            type: "string",
                            example: "Uriol Hernan"
                        },
                        nif: {
                            type: "string",
                            example: "40000000W"
                        },
                    },
                },
                verificationCtrl: {
                    type: "object",
                    required: ["verifyCode"],
                    properties: {
                        verifyCode: {
                            type: "string",
                            example: "000000"
                        }
                    },
                },
                createClient: {
                    type: "object",
                    required: ["name", "cif", "address"],
                    properties: {
                        name: {
                            type: "string",
                            example: "ACS"
                        },
                        cif: {
                            type: "string",
                            example: "D52921210"
                        },
                        address: {
                            type: "object",
                            required: ["street", "number", "postal", "city", "province"],
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "number",
                                    example: 22
                                },
                                postal: {
                                    type: "number",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                updateClient: {
                    type: "object",
                    required: ["name", "cif", "address"],
                    properties: {
                        name: {
                            type: "string",
                            example: "ACS"
                        },
                        cif: {
                            type: "string",
                            example: "D52921210"
                        },
                        address: {
                            type: "object",
                            required: ["street", "number", "postal", "city", "province"],
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "number",
                                    example: 22
                                },
                                postal: {
                                    type: "number",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        }
                    }
                },
                archivarCliente: {
                    type: "object",
                    required: ["cif"],
                    properties: {
                        cif: {
                            type: "string",
                            example: "D52921222"
                        }
                    }
                },
                restoreClient: {
                    type: "object",
                    required: ["cif"],
                    properties: {
                        cif: {
                            type: "string",
                            example: "D52921222"
                        }
                    }
                },
                deleteClient: {
                    type: "object",
                    required: ["cif"],
                    properties: {
                        cif: {
                            type: "string",
                            example: "D52921222"
                        }
                    }
                },
                createProject: {
                    type: "object",
                    required: ["name", "email", "address", "code", "clientId"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nombre del proyecto"
                        },
                        email: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        address: {
                            type: "object",
                            required: ["street", "number", "postal", "city", "province"],
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "number",
                                    example: 22
                                },
                                postal: {
                                    type: "number",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        },
                        code: {
                            type: "string",
                            example: "Código interno del proyecto"
                        },
                        clientId: {
                            type: "string",
                            example: "mongoId"
                        }
                    }
                },
                updateProject: {
                    type: "object",
                    required: ["name", "email", "address", "code", "notes"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Nombre del proyecto"
                        },
                        email: {
                            type: "string",
                            example: "mimail@gmail.com"
                        },
                        address: {
                            type: "object",
                            required: ["street", "number", "postal", "city", "province"],
                            properties: {
                                street: {
                                    type: "string",
                                    example: "Carlos V"
                                },
                                number: {
                                    type: "number",
                                    example: 22
                                },
                                postal: {
                                    type: "number",
                                    example: 28936
                                },
                                city: {
                                    type: "string",
                                    example: "Móstoles"
                                },
                                province: {
                                    type: "string",
                                    example: "Madrid"
                                }
                            }
                        },
                        code: {
                            type: "string",
                            example: "Código interno del proyecto"
                        },
                        notes: {
                            type: "string",
                            example: "actualización 2"
                        }
                    }
                },
                createDelivery: {
                    type: "object",
                    required: ["clientId", "projectId", "format", "material", "hours", "description", "workdate"],
                    properties: {
                        clientId: {
                            type: "string",
                            example: "67f54d6b86271c31199a2e9e"
                        },
                        projectId: {
                            type: "string",
                            example: "67f54d6b86271c31199a2e9e"
                        },
                        format: {
                            type: "string",
                            example: "material o hours"
                        },
                        material: {
                            type: "string",
                            example: "wood"
                        },
                        hours: {
                            type: "number",
                            example: 6
                        },
                        description: {
                            type: "string",
                            example: "description of deliverynote"
                        },
                        workdate: {
                            type: "date",
                            example: "2/1/2024"
                        }
                    }
                }
            },
        },
    },
    apis: ["./routes/*.js"],
};
module.exports = swaggerJsdoc(options)