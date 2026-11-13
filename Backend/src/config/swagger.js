const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Banking Management System API",
            version: "1.0.0",
            description: "Production-ready REST API documentation for the Banking Management System. This API handles user registration/login, account creation, deposits, and double-entry ledger-backed money transfers.",
            contact: {
                name: "API Support",
                email: "support@banking-system.local"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],
        tags: [
            {
                name: "Authentication",
                description: "User signup, login, and JWT cookie session management"
            },
            {
                name: "Accounts",
                description: "Account creation and management"
            },
            {
                name: "Transactions",
                description: "Financial transactions including cash deposits and peer-to-peer transfers"
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                    description: "JWT session cookie received upon successful login or registration"
                },
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Optional Bearer JWT token header"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        name: {
                            type: "string",
                            example: "John Doe"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            example: "john.doe@example.com"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-07T10:00:00.000Z"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            example: "2026-11-07T10:00:00.000Z"
                        }
                    }
                },
                UserRegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            description: "Unique username / full name",
                            example: "John Doe"
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Unique valid email address",
                            example: "john.doe@example.com"
                        },
                        password: {
                            type: "string",
                            minLength: 8,
                            description: "User password (minimum 8 characters)",
                            example: "SecurePass123!"
                        }
                    }
                },
                UserLoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "john.doe@example.com"
                        },
                        password: {
                            type: "string",
                            example: "SecurePass123!"
                        }
                    }
                },
                Account: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Account ID (matches user _id or assigned ObjectId)",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        name: {
                            type: "string",
                            example: "John's Savings Account"
                        },
                        balance: {
                            type: "number",
                            description: "Account balance",
                            example: 15000.50
                        },
                        status: {
                            type: "string",
                            enum: ["ACTIVE", "FROZEN", "CLOSED"],
                            example: "ACTIVE"
                        },
                        currency: {
                            type: "string",
                            default: "NPR",
                            example: "NPR"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                CreateAccountRequest: {
                    type: "object",
                    required: ["user", "name"],
                    properties: {
                        user: {
                            type: "string",
                            description: "The User ID to associate with the account",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        name: {
                            type: "string",
                            description: "Unique account identifier name",
                            example: "John Savings"
                        }
                    }
                },
                DepositRequest: {
                    type: "object",
                    required: ["user", "moneyadd", "IdempotencyKey"],
                    properties: {
                        user: {
                            type: "string",
                            description: "Target account ID to deposit money into",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        moneyadd: {
                            type: "number",
                            minimum: 0.01,
                            description: "Amount to deposit (must be greater than zero)",
                            example: 5000
                        },
                        Description: {
                            type: "string",
                            description: "Note or reason for the deposit",
                            example: "Cash deposit via branch counter"
                        },
                        IdempotencyKey: {
                            type: "string",
                            description: "Unique key to ensure idempotency and prevent duplicate processing",
                            example: "dep-9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                        }
                    }
                },
                TransferRequest: {
                    type: "object",
                    required: ["fromAccount", "toAccount", "amount", "IdempotencyKey"],
                    properties: {
                        fromAccount: {
                            type: "string",
                            description: "Source account ID",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        toAccount: {
                            type: "string",
                            description: "Destination account ID",
                            example: "6724ba5080164e24ef5471b2"
                        },
                        amount: {
                            type: "number",
                            minimum: 0.01,
                            description: "Amount to transfer (must not exceed available balance)",
                            example: 1200
                        },
                        IdempotencyKey: {
                            type: "string",
                            description: "Unique idempotency key to prevent double transfers",
                            example: "tx-f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
                        }
                    }
                },
                Transaction: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6724bb9e80164e24ef5471c5"
                        },
                        fromAccount: {
                            type: "string",
                            nullable: true,
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        toAccount: {
                            type: "string",
                            nullable: true,
                            example: "6724ba5080164e24ef5471b2"
                        },
                        type: {
                            type: "string",
                            enum: ["deposit", "withdrawal", "transfer"],
                            example: "transfer"
                        },
                        amount: {
                            type: "number",
                            example: 1200
                        },
                        idempotencyKey: {
                            type: "string",
                            example: "tx-f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
                        },
                        status: {
                            type: "string",
                            enum: ["pending", "completed", "failed"],
                            example: "completed"
                        },
                        description: {
                            type: "string",
                            example: "Amount has been Transferred."
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                LedgerEntry: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "6724bc2280164e24ef5471d8"
                        },
                        account: {
                            type: "string",
                            description: "Referenced Account ID",
                            example: "6724ba1f80164e24ef5471a1"
                        },
                        amount: {
                            type: "number",
                            example: 1200
                        },
                        transaction: {
                            type: "string",
                            description: "Referenced Transaction ID",
                            example: "6724bb9e80164e24ef5471c5"
                        },
                        type: {
                            type: "string",
                            enum: ["CREDIT", "DEBIT"],
                            example: "DEBIT"
                        }
                    }
                },
                ApiResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Operation completed successfully"
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "An error occurred"
                        },
                        status: {
                            type: "string",
                            example: "failed"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/**/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;