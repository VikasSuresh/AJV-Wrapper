/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = (ajv) => {
    ajv.addKeyword({
        keyword: 'parse',
        type: 'string',
        compile: (parse, { format }) => {
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
        modifying: true,
        errors: false,
        metaSchema: {
            type: 'boolean',
            const: true,
        },
    });
};
