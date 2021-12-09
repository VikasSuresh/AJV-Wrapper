const addFormats = require('ajv-formats');
const { ObjectId } = require('mongodb');

module.exports = (ajv) => {
    ajv.addFormat('objectId', (id) => id.length === 24 && ObjectId.isValid(id));
    addFormats(ajv);
};
