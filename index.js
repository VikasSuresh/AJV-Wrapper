const Ajv = require('ajv');
const Format = require('./format');
const Parse = require('./parse');

const ajv = new Ajv({ useDefaults: true });

Format(ajv);
Parse(ajv);

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
