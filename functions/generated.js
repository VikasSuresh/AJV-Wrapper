/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = (ajv) => {
    ajv.addKeyword({
        keyword: 'generated',
        type: 'string',
        validate: function validate(generated, data, object, { parentData, parentDataProperty }) {
            let returnValue = true;

            switch (generated) {
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
                validate.errors = [{ keyword: 'generated', message: 'value should be valid.', params: { keyword: 'parse' } }];
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
