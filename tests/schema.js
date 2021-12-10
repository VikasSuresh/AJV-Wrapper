module.exports = {
    required: [],
    type: 'object',
    properties: {
        stringInput: {
            type: 'string',
        },
        excerptInput: {
            type: 'string',
            default: '',
            excerpt: {
                $data: '1/stringInput',
                limit: 100,
            },
        },
        dateInput: {
            type: 'string',
            format: 'date',
            parse: true,
        },
        numberInput: {
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
                    default: '',
                    excerpt: {
                        $data: '2/stringInput',
                        limit: 100,
                    },
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
                    },
                },
            },
        },
    },
    additionalProperties: false,
};

/* TODO
    1.Check For AnyOf and other things
    2.Check for required.
    3. Check for null.
*/
