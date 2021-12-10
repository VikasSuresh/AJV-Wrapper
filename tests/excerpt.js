const Main = require('../index');
const Schema = require('./schema');

const input = {
    stringInput: '<h4> hi <h4>',
    excerptInput: '',
    object: {
        objectIdInput: '12345678901234567890abcd',
        stringInput: '',
    },
};

Main(input, Schema);
