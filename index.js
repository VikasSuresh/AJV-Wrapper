const Ajv = require('ajv');
const Format = require('./format');
const Parse = require('./parse');
const Excerpt = require('./excerpt');

const ajv = new Ajv({ useDefaults: true, $data: true });

Format(ajv);
Parse(ajv);
Excerpt(ajv);

const Main = (data, schema) => {
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

module.exports = Main;
