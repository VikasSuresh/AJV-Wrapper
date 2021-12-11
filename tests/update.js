/* eslint-disable no-param-reassign */
const util = require('util');
const { check } = require('../functions');

const Schema = {
    type: 'object',
    additionalProperties: false,
    // required: [
    //     'message',
    //     'userIds',
    //     'tags',
    // ],
    properties: {
        message: {
            type: 'string',
        },
        objectId: {
            type: 'string',
            generate: 'objectId',
        },
        userIds: {
            type: 'array',
            items: {
                type: 'string',
                format: 'objectId',
                parse: true,
            },
        },
        tags: {
            type: 'array',
            items: {
                type: 'string',
                format: 'objectId',
                parse: true,
            },
        },
        quizzes: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        generate: 'objectId',
                    },
                    wk: {
                        type: 'number',
                    },
                    score: {
                        type: 'number',
                    },
                },
                additionalProperties: false,
                required: [],
            },
        },
    },
};

const update = {
    $set: {
        message: '1',
        objectId: '',
    },
    $push: {
        userIds: '12345678901234567890abcd',
        quizzes: {
            $each: [{ wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 }],
            $sort: { score: -1 },
            $slice: 3,
        },
    },
    $pull: {
        tags: {
            $in: [
                '12345678901234567890abcd',
            ],
        },
        quizzes: {
            _id: {
                $in: ['12345678901234567890abcd'],
            },
        },
    },
    objectId: {
        $in: ['12345678901234567890abcd'],
    },
};

const isObject = (data) => data && typeof data === 'object' && !Array.isArray(data);
const fetchParentLevel = (field, parent) => (field.startsWith('$') ? `${ parent }` : `${ parent }.${ field }`);

const skipKeywords = ['$sort', '$slice'];

const keywords = ['$each', '$in'];

const validate = check.compile(Schema);

const hasError = (data) => {
    const valid = validate(data);

    if (!valid) {
        const error = new Error('Arguments Validation Failed!');
        error.validations = validate.errors;
        error.errorCode = 400;
        throw error;
    }

    return data;
};

const recur = (input, level = '') => {
    let compiled = {};
    if (isObject(input)) {
        compiled = Object.keys(input).reduce((acc, field) => {
            if (skipKeywords.includes(field)) {
                const returnData = { ...acc, [ field ]: input[ field ] };
                delete input[ field ];
                return returnData;
            }

            if (isObject(input[ field ]) || keywords.includes(field)) {
                const recuredData = { ...acc, [ field ]: recur(input[ field ], fetchParentLevel(field, level)) };
                delete input[ field ];
                return recuredData;
            }

            return acc;
        }, {});
    }

    if (Array.isArray(input)) {
        const returnVariable = level.slice(1);
        input = {
            [ returnVariable ]: input,
        };

        input = hasError(input);

        return input[ returnVariable ];
    }

    if (input && Object.keys(input).length > 0) {
        input = hasError(input);
    }

    return {
        ...input,
        ...compiled,
    };
};

console.log(util.inspect(recur(update), { showHidden: false, depth: null, colors: true }));

/*
    isObject - Checks whether the data is an object
    fetchParentLevel - Returns concatenated value in case of normal field in case if $ comes will return the original field.
    skipKeywords - for skipping wihtout validating
    keywords - make sure the values are validated
    validate - ajv compile
    hasError - Gets the input and validate if it has error it throws else return data

    recur:
        - Gets the input as an object
        - When its an object it ll iterate
            - If it is included in skipKeywords the field is deleted.
            - If it is an object or included in keywords, recur is called again and the field is deleted.
            - If it is none of those then it is kept in input object

        - The input obtained either from iterator or from function is checked whether its an arry or object
        - The input is validated against schema.
        - If its an array its returend
        - Else its spreaded

*/
