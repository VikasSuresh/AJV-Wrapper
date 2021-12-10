module.exports = {
    required: [],
    type: 'object',
    properties: {
        stringInput: {
            type: 'string',
        },
        excerptInput: {
            type: 'string',
            excerpt: {
                $data: '1/stringInput',
                limit: 100,
            },
        },
        generatedDateInput: {
            type: ['string', 'null'],
            generate: 'date',
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
                generatedDateTimeInput: {
                    type: 'string',
                    generate: 'date-time',
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
                    generatedId: {
                        type: 'string',
                        generate: 'objectId',
                    },
                    objectIdInput: {
                        type: ['string', 'null'],
                        format: 'objectId',
                        parse: true,
                    },
                    stringInput: {
                        type: 'string',
                    },
                },
            },
        },
        oneOfInput: {
            oneOf: [
                { type: 'string', format: 'date-time', parse: true },
                { type: 'string', generate: 'date-time' },
            ],
        },
    },
    additionalProperties: false,
};

/* TODO
    1.Check For AnyOf and other things
    2.Check for required - Working.
    3. Check for null. - Working
*/
