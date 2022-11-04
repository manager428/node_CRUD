export default {
    getInfo: {
        get: {
            tags: [
                'Admin',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            description: 'Get admin data using JWT token',
            responses: {
                200: {
                    description: 'Admin data',
                    schema: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/400',
                },
                401: {
                    $ref: '#/components/responses/401',
                },
                404: {
                    $ref: '#/components/responses/404',
                },
                406: {
                    $ref: '#/components/responses/404',
                },
                500: {
                    $ref: '#/components/responses/500',
                },
            },
        }
    },
    register: {
        post: {
            tags: [
                'Admin',
            ],
            description: 'Add a new admin in DB if no admin exist. Otherwise, returns conflict error.',
            parameters: [
                {
                    name: 'body',
                    in: 'body',
                    description: 'Body for creating new admin',
                    schema: {
                        type: 'object',
                        required: [
                            'fullname',
                            'email',
                            'password',
                        ],
                        properties: {
                            fullname: {
                                type: 'string',
                            },
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
            produces: [
                'application/json',
            ],
            responses: {
                201: {
                    description: 'New user registered',
                    schema: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/400',
                },
                401: {
                    $ref: '#/components/responses/401',
                },
                404: {
                    $ref: '#/components/responses/404',
                },
                406: {
                    $ref: '#/components/responses/404',
                },
                500: {
                    $ref: '#/components/responses/500',
                },
            },
        },
    },
    update: {
        put: {
            tags: [
                'Admin',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            description: 'Update current admin if holds JWT token',
            parameters: [
                {
                    name: 'body',
                    in: 'body',
                    description: 'Body for updating new admin',
                    schema: {
                        type: 'object',
                        properties: {
                            fullname: {
                                type: 'string',
                            },
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
            produces: [
                'application/json',
            ],
            responses: {
                200: {
                    description: 'Admin updated',
                    schema: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'object',
                                $ref: '#/definitions/User',
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/400',
                },
                401: {
                    $ref: '#/components/responses/401',
                },
                404: {
                    $ref: '#/components/responses/404',
                },
                500: {
                    $ref: '#/components/responses/500',
                },
            },
        },
    },
    login: {
        post: {
            tags: [
                'Admin',
            ],
            description: 'Login admin in dashboard.',
            parameters: [
                {
                    name: 'body',
                    in: 'body',
                    description: 'Body for login',
                    schema: {
                        type: 'object',
                        required: [
                            'email',
                            'password',
                        ],
                        properties: {
                            email: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },
            ],
            produces: [
                'application/json',
            ],
            responses: {
                200: {
                    description: 'User logins',
                    schema: {
                        type: 'object',
                        properties: {

                            data: {
                                type: 'object',
                                $ref: '#/definitions/Token',
                            },
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/400',
                },
                401: {
                    $ref: '#/components/responses/401',
                },
                404: {
                    $ref: '#/components/responses/404',
                },
                500: {
                    $ref: '#/components/responses/500',
                },
            },
        },
    },
    delete: {
        delete: {
            tags: [
                'Admin',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            description: 'Delete admin',
            produces: [
                'application/json',
            ],
            responses: {
                200: {
                    description: 'User logins',
                    schema: {
                        type: 'object',
                        properties: {
                            status: 'success',
                            message: 'successfully deleted',
                        },
                    },
                },
                400: {
                    $ref: '#/components/responses/400',
                },
                401: {
                    $ref: '#/components/responses/401',
                },
                404: {
                    $ref: '#/components/responses/404',
                },
                500: {
                    $ref: '#/components/responses/500',
                },
            },
        },
    },
};
