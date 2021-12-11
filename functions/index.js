const Ajv = require('ajv');
const Format = require('./format');
const Parse = require('./parse');
const Excerpt = require('./excerpt');
const Generate = require('./generate');

const ajv = new Ajv({ useDefaults: true, $data: true });

Format(ajv);
Parse(ajv);
Excerpt(ajv);
Generate(ajv);

module.exports = {
    check: ajv,
    // updateCheck: ajv.removeKeyword('required').removeKeyword('default'),
};
