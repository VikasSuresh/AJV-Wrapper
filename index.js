const { check, updateCheck } = require('./functions');

const Main = (data, schema) => {
    try {
        console.time('test');
        const validate = check.compile(schema);
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
