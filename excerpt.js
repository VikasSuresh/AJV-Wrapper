/* eslint-disable no-param-reassign */
const { stripHtml } = require('string-strip-html');

module.exports = (ajv) => {
    ajv.addKeyword({
        keyword: 'excerpt',
        $data: true,
        validate: function validate(data, dataPath, { type, excerpt: { $data, limit } }, { parentData, parentDataProperty }) {
            if ($data && type === 'string' && data && typeof data === 'string') {
                parentData[ parentDataProperty ] = stripHtml(data).result.slice(0, limit || 300);
                return true;
            }

            validate.errors = [{ keyword: 'excerpt', message: 'excerpt data should be valid or of type string or shouldn\'t be empty.', params: { keyword: 'excerpt' } }];
            return false;
        },
        modifying: true,
        errors: true,
    });
};
