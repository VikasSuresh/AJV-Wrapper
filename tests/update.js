/* eslint-disable no-param-reassign */
const util = require('util');
const objectPath = require('object-path');
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
        tag: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    generate: 'date',
                },
                number: {
                    type: 'number',
                },
            },
        },
        userIds: {
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
                    // array: {
                    //     type: 'array',
                    //     items: {
                    //         type: 'object',
                    //         properties: {
                    //             objectId: {
                    //                 type: 'string',
                    //                 generate: 'objectId',
                    //             },
                    //         },
                    //         additionalProperties: false,
                    //         required: [],
                    //     },
                    // },
                },
                additionalProperties: false,
                required: [],
            },
        },
    },
};

const update = {
    // $set: {
    //     message: '1',
    //     objectId: '',
    //     userIds: ['12345678901234567890abcd'],
    //     tag: {
    //         number: 1,
    //     },
    // },
    // $unset: {
    //     message: '',
    // },
    // $push: {
    //     userIds: '12345678901234567890abcd',
    //     // userIds: ['12345678901234567890abcd'],
    //     quizzes: {
    //         $each: [{ _id: '', wk: 5, score: 8 }, { _id: '', wk: 6, score: 7 }, { _id: '', wk: 7, score: 6 }],
    //         $sort: { score: -1 },
    //         $slice: 3,
    //     },
    // },
    // $pullAll: {
    //     // userIds: '12345678901234567890abcd',
    //     userIds: ['12345678901234567890abcd'],
    // },
    // $pull: {
    //     userIds: {
    //         $in: [
    //             '12345678901234567890abcd',
    //         ],
    //     },
    //     quizzes: {
    //         _id: {
    //             $in: ['12345678901234567890abcd'],
    //         },
    //     },
    // },
    objectId: {
        $in: ['12345678901234567890abcd'],
    },
    message: {
        $ne: '',
    },
    userIds: '',
    tag: {
        number: {
            $eq: 12,
        },
    },
};

const isObject = (data) => data && typeof data === 'object' && !Array.isArray(data);

const skipKeywords = ['$sort', '$slice', '$unset'];

const arrayKeywords = ['$each', '$in'];

const executeableKeywords = ['$set'];

const hasError = (data, schema) => {
    const validate = check.compile(schema);
    const valid = validate(data);
    if (!valid) {
        const error = new Error('Arguments Validation Failed!');
        error.validations = validate.errors;
        error.errorCode = 400;
        throw error;
    }

    return data;
};

const buildSchema = (cond, level) => {
    cond = cond.filter((el) => el);
    level = level.filter((el) => el);

    let schema = {};
    if (cond.includes('$push') || cond.includes('$pull') || cond.includes('$pullAll')) {
        const defaultArraySchema = objectPath.get(Schema, `properties.${ level[ level.length - 1 ] }`);
        if (cond.includes('$each')) {
            schema = defaultArraySchema;
        } else {
            schema = {
                oneOf: [
                    objectPath.get(Schema, `properties.${ level[ level.length - 1 ] }.items`),
                    defaultArraySchema,
                ],
            };
        }
    } else if (cond.includes('$in') || cond.includes('$nin')) {

    }

    return schema;
};

const Parser = (input, compiled, parentLevel) => {
    if ((input && Object.keys(input).length > 0) || Array.isArray(input)) {
        const [cond, level] = parentLevel
            .split('.')
            .reduce(([c, l], s) => (s.startsWith('$') ? [[...c, s], l] : [c, [...l, s]]), [[], []]);

        if (executeableKeywords.includes(cond[ 0 ])) {
            input = hasError(input, Schema);
        } else if (Array.isArray(input)) {
            const schema = buildSchema(cond, level);

            input = hasError(input, schema);

            return input;
        } else {
            const schema = Object.keys(input).reduce((a, k) => ({
                ...a,
                [ k ]: k.startsWith('$') ? buildSchema([...cond, k], level) : buildSchema(cond, [...level, k]),
            }), {});

            console.log(schema);

            input = hasError(input, {
                type: 'object',
                properties: schema,
                additionalProperties: false,
            });
        }
    }
    return {
        ...input,
        ...compiled,
    };
};

const recur = (input, level = '', before = '') => {
    let compiled = {};
    if (isObject(input) && !executeableKeywords.includes(before)) {
        compiled = Object.keys(input).reduce((acc, field) => {
            if (skipKeywords.includes(field)) {
                const returnData = { ...acc, [ field ]: input[ field ] };
                delete input[ field ];
                return returnData;
            }

            if (isObject(input[ field ]) || arrayKeywords.includes(field)) {
                const recuredData = { ...acc, [ field ]: recur(input[ field ], `${ level }.${ field }`, field) };
                delete input[ field ];
                return recuredData;
            }

            return acc;
        }, {});
    }

    return Parser(input, compiled, level);
};

console.log(util.inspect(recur(update), { showHidden: false, depth: null, colors: true }));

/*
    isObject - Checks whether the data is an object
    fetchParentLevel - Returns concatenated value in case of normal field in case if $ comes will return the original field. - removed
    skipKeywords - for skipping wihtout validating
    arrayKeywords - make sure the values are validated
    validate - ajv compile
    hasError - Gets the input and validate if it has error it throws else return data

    recur:
        - Gets the input as an object
        - When its an object it ll iterate
            - If it is included in skipKeywords the field is deleted.
            - If it is an object or included in arrayKeywords, recur is called again and the field is deleted.
            - If it is none of those then it is kept in input object

        - The input obtained either from iterator or from function is checked whether its an arry or object
        - The input is validated against schema.
        - If its an array its returend
        - Else its spreaded

*/
