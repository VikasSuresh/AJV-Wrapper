const Main = require('../index');
const Schema = require('./schema');

const input = {
    dateInput: '2021-12-12',
    numberInput: 1234,
    objectIdInput: '12345678901234567890abcd',
    dateTimeInput: '2021-12-10T09:40:50.649Z',
    object: {
        objectIdInput: '12345678901234567890abcd',
        dateTimeInput: '2021-12-10T09:40:50.649Z',
    },
    arrayOfString: ['12345678901234567890abcd', '09876543210987654321abcd', '10293847561029384756abcd'],
    arrayOfObjects: [{
        objectIdInput: '12345678901234567890abcd',
        stringInput: 'test',
    }],
};

Main(input, Schema);
