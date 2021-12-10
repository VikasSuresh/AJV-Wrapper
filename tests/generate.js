const Main = require('../index');
const Schema = require('./schema');

const input = {
    arrayOfObjects: [{
        generatedId: '',
        objectIdInput: '12345678901234567890abcd',
        stringInput: 'test',
    }],
    object: { generatedDateTimeInput: '', objectIdInput: '12345678901234567890abcd' },
    generatedDateInput: '',
};

Main(input, Schema);
