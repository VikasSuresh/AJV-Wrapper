/* eslint-disable no-param-reassign */
const { ObjectId } = require('mongodb');

module.exports = (ajv) => {
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
};
