const Main = require('../index');
const Schema = require('./schema');

const input = {
    arrayOfObjects: [{
        generatedId: '09876543210987654321abcd',
        objectIdInput: '12345678901234567890abcd',
        stringInput: 'test',
    }],
    object: { generatedDateTimeInput: '', objectIdInput: '12345678901234567890abcd' },
    generatedDateInput: null,
};

Main(input, Schema);
