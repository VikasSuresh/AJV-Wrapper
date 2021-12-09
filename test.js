const Main = require('./index');

const input = {
    objectIdInput: '12345678901234567890abcd',
};

const schema = {
    required: [],
    type: 'object',
    properties: {
        dateInput: {
            type: 'string',
            format: 'date',
            parse: true,
        },
        number: {
            type: 'number',
            default: 10,
        },
        objectIdInput: {
            type: 'string',
            format: 'objectId',
            parse: true,
        },
        dateTimeInput: {
            type: 'string',
            format: 'date-time',
            parse: true,
        },
        object: {
            type: 'object',
            required: ['dateTimeInput'],
            additionalProperties: false,
            properties: {
                objectIdInput: {
                    type: 'string',
                    format: 'objectId',
                    parse: true,
                },
                dateTimeInput: {
                    type: 'string',
                    format: 'date-time',
                    parse: true,
                },
            },
        },
        arrayOfString: {
            type: 'array',
            items: {
                type: 'string',
                format: 'objectId',
                parse: true,
            },
        },
        arrayOfObjects: {
            type: 'array',
            items: {
                type: 'object',
                required: ['objectIdInput'],
                additionalProperties: false,
                properties: {
                    objectIdInput: {
                        type: 'string',
                        format: 'objectId',
                        parse: true,
                    },
                    stringInput: {
                        type: 'string',
                        parse: true,
                    },
                },
            },
        },
    },
    additionalProperties: false,
};

Main(input, schema);
