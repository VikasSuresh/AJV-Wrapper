const Main = require('../index');
const Schema = require('./schema');

const input = {
    oneOfInput: '2021-12-10T09:40:50.649Z',
    anyOfInput: '',
    notInput: '1',
    allOfInput: '',
};

Main(input, Schema);
