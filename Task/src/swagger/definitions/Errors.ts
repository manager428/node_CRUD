const Errors = {
    401: {
        type: 'object',
        properties: {
            status: {
                type: 'integer',
                default: 401,
            },
            message: {
                type: 'string',
                default: 'Invalid user token',
            },
        },
    },
    404: {
        type: 'object',
        properties: {
            status: {
                type: 'integer',
                default: 404,
            },
            message: {
                type: 'string',
                default: 'Invalid user token',
            },
        },
    },
    400: {
        type: 'object',
        properties: {
            status: {
                type: 'integer',
                default: 400,
            },
            message: {
                type: 'string',
                default: 'Invalid user token',
            },
        },
    },
    500: {
        type: 'object',
        properties: {
            status: {
                type: 'integer',
                default: 500,
            },
            message: {
                type: 'string',
                default: 'Invalid user token',
            },
        },
    },
};

export default Errors;