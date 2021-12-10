/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = (ajv) => {
    ajv.addKeyword({
        keyword: 'parse',
        type: 'string',
        validate: function validate(parse, data, { format }, { parentData, parentDataProperty }) {
            let returnValue = true;

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
                validate.errors = [{ keyword: 'parse', message: 'value should be valid format or format should be in [objectId, date, date-time].', params: { keyword: 'parse' } }];
                returnValue = false;
                break;
            }
            return returnValue;
        },
        modifying: true,
        errors: true,
        metaSchema: {
            type: 'boolean',
            const: true,
        },
    });
};
