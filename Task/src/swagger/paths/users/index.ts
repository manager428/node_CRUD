export default {
    'get-all-user': {
        parameters: [],
        get: {
            tags: [
                'Users',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            summary: 'Get all users',
            responses: {
                200: {
                    description: 'User is found in db',
                    schema: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    $ref: '#/definitions/User',
                                }
                            },
                            pagination: {
                                type: 'object',
                                $ref: '#/definitions/Pagination'
                            }
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
    'create-user': {
        post: {
            parameters: [
                {
                    name: 'body',
                    in: 'body',
                    description: 'Body for creating user',
                    schema: {
                        type: 'object',
                        required: [
                            'username',
                            'email',
                            'password',
                        ],
                        properties: {
                            email: {
                                type: 'string',
                            },
                            username: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                        },
                    },
                },

            ],
            tags: [
                'Users',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            summary: 'Create User',
            responses: {
                201: {
                    description: 'User is created in db',
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
        }
    },
    'get-user': {
        get: {
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    description: 'Id of user',
                    type: 'string',
                },
            ],
            tags: [
                'Users',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            summary: 'Get specific user',
            responses: {
                200: {
                    description: 'User is found in db',
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
        put: {
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    description: 'Id of user',
                    type: 'string',
                },
            ],
            tags: [
                'Users',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            summary: 'Update specific user',
            responses: {
                200: {
                    description: 'User is found in db',
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
        delete: {
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    description: 'Id of user',
                    type: 'string',
                },
            ],
            tags: [
                'Users',
            ],
            security: [
                {
                    Bearer: [],
                },
            ],
            summary: 'Delete specific user',
            responses: {
                200: {
                    description: 'User is found in db',
                    schema: {
                        type: 'object',
                        properties: {
                            status: 'success',
                            message: 'successfully deleted'
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
