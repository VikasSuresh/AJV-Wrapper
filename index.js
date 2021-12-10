const Ajv = require('ajv');
const Format = require('./functions/format');
const Parse = require('./functions/parse');
const Excerpt = require('./functions/excerpt');
const Generate = require('./functions/generate');

const ajv = new Ajv({ useDefaults: true, $data: true });

Format(ajv);
Parse(ajv);
Excerpt(ajv);
Generate(ajv);

const Main = (data, schema) => {
    try {
        console.time('test');
        const validate = ajv.compile(schema);
        const valid = validate(data);
        if (!valid) {
            const error = new Error('error');
            error.validations = validate.errors;
            throw error;
        }
        console.log(data, 'log');
        console.timeEnd('test');
    } catch (error) {
        console.log(error.validations, error.toString());
    }
};

module.exports = Main;
