/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ useDefaults: true });
ajv.addFormat('objectId', (id) => id.length === 24 && ObjectId.isValid(id));
addFormats(ajv);

ajv.addKeyword({
    keyword: 'parse',
    type: 'string',
    compile: (sch, parentSchema) => {
        const { parse, format } = parentSchema;
        if (parse) {
            return (data, { parentData, parentDataProperty }) => {
                switch (format) {
                case 'objectId':
                    parentData[ parentDataProperty ] = ObjectId(data);
                    break;
                case 'date':
                    parentData[ parentDataProperty ] = new Date(data).toString();
                    break;
                case 'date-time':
                    parentData[ parentDataProperty ] = new Date(data);
                    break;
                default:
                    break;
                }
                return true;
            };
        }
        return () => false;
    },
    errors: false,
    metaSchema: {
        type: 'boolean',
        const: true,
    },
});

const main = (data, schema) => {
    try {
        const validate = ajv.compile(schema);
        const valid = validate(data);
        if (!valid) {
            const error = new Error('error');
            error.validations = validate.errors;
            throw error;
        }
        console.log(data, 'log');
    } catch (error) {
        console.log(error.validations, error.toString());
    }
};

main({
    objectIdInput: '12345678901234567890abcd',
}, {
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
});
