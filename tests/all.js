const Main = require('../index');
const Schema = require('./schema');

const input = {
    stringInput: `<a href="http://hu.lipsum.com/">Magyar</a>
        <a href="http://id.lipsum.com/">Indonesia</a> 
        <a href="http://it.lipsum.com/">Italiano</a> 
        <a href="http://lv.lipsum.com/">Latviski</a> 
        <a href="http://lt.lipsum.com/">Lietuviškai</a> 
        <a href="http://mk.lipsum.com/">македонски</a> 
        <a href="http://ms.lipsum.com/">Melayu</a>
        <a href="http://no.lipsum.com/">Norsk</a>
        <a href="http://pl.lipsum.com/">Polski</a>
        <a href="http://pt.lipsum.com/">Português</a> 
        <a href="http://ro.lipsum.com/">Româna</a> 
        <a href="http://ru.lipsum.com/">Pyccкий</a>
        <a href="http://sr.lipsum.com/">Српски</a> 
        <a href="http://sk.lipsum.com/">Slovenčina</a>
        <a href="http://sl.lipsum.com/">Slovenščina</a> 
        <a href="http://es.lipsum.com/">Español</a>
        <a href="http://sv.lipsum.com/">Svenska</a>
    `,
    dateInput: '2021-12-12',
    numberInput: 1234,
    excerptInput: '',
    objectIdInput: '12345678901234567890abcd',
    dateTimeInput: '2021-12-10T09:40:50.649Z',
    generatedDateInput: '',
    object: {
        objectIdInput: '12345678901234567890abcd',
        stringInput: '',
        dateTimeInput: '2021-12-10T09:40:50.649Z',
        generatedDateTimeInput: '',
    },
    arrayOfString: ['12345678901234567890abcd', '09876543210987654321abcd', '10293847561029384756abcd'],
    arrayOfObjects: [{
        generatedId: '',
        objectIdInput: '12345678901234567890abcd',
        stringInput: 'test',
    },
    {
        generatedId: '',
        objectIdInput: '12345678901234567890abcd',
        stringInput: 'test',
    }],
};

Main(input, Schema);
