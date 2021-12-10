/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

const GenSchema = (format) => ({
    type: 'object',
    properties: {
        data: {
            type: 'string',
            format,
            parse: true,
        },
    },
    additionalProperties: false,
    required: ['data'],
});

module.exports = (ajv) => {
    ajv.addKeyword({
        keyword: 'generate',
        type: 'string',
        validate: function validate(generate, data, { generate: format }, { parentData, parentDataProperty }) {
            let returnValue = true;

            // Making sure that data is of type object so that it can compile using ajv and return the parsed data, its again destructured
            if (data !== '') {
                data = { data };
                const validation = ajv.compile(GenSchema(format));
                const isValid = validation(data);
                if (isValid) {
                    parentData[ parentDataProperty ] = data.data;
                    return true;
                }
                validate.errors = validation.errors;
                return false;
            }

            switch (generate) {
            case 'objectId':
                parentData[ parentDataProperty ] = ObjectId();
                break;
            case 'date':
                parentData[ parentDataProperty ] = new Date().toString();
                break;
            case 'date-time':
                parentData[ parentDataProperty ] = new Date();
                break;
            default:
                validate.errors = [{ keyword: 'generate', message: 'value should be valid.', params: { keyword: 'generate' } }];
                returnValue = false;
                break;
            }
            return returnValue;
        },
        modifying: true,
        errors: true,
        metaSchema: {
            type: 'string',
            enum: ['objectId', 'date', 'date-time'],
        },
    });
};
