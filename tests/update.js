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
                type: ['string', 'null'],
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
        settings: {
            type: 'object',
            properties: {
                isDeleted: { type: 'boolean' },
            },
            additionalProperties: false,
            required: [],
        },
    },
};

const update = {
    // $set: {
    //     message: '1',
    //     objectId: '61b60ce0a6180192a2909de4',
    //     userIds: ['61b60ce0a6180192a2909de4'],
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
    // 'settings.isDeleted': false,
    // objectId: {
    //     $in: ['12345678901234567890abcd'],
    // },
    // message: {
    //     $ne: '',
    // },
    // message: {
    //     $nin: [''],
    // },
    // userIds: null,
    // tag: {
    //     number: {
    //         $eq: 12,
    //     },
    // },
    // $min: {
    //     'tag.date': '2013-09-25',
    // },
};

const isObject = (data) => data && typeof data === 'object' && !Array.isArray(data);

const skipKeywords = ['$sort', '$slice', '$unset'];

const executeableKeywords = ['$set'];

const arrayKeywords = ['$push', '$pull', '$pullAll'];

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

const generateSchema = (level, path = '') => {
    if (level.length === 0) {
        return objectPath.get(Schema, path.slice(0, -1));
    }

    if (objectPath.get(Schema, `${ path }properties.${ level[ 0 ] }`)) {
        return generateSchema(level.slice(1), `${ path }properties.${ level[ 0 ] }.`);
    }

    if (objectPath.get(Schema, `${ path }items.properties.${ level[ 0 ] }`)) {
        return generateSchema(level.slice(1), `${ path }items.properties.${ level[ 0 ] }.`);
    }

    const error = new Error('Invalid Path Level!');
    error.errorCode = 406;
    throw error;
};

const build = (cond, level, input) => {
    cond = cond.filter((el) => el);
    level = level.filter((el) => el);

    const defaultSchema = generateSchema(level);

    let schema = {};
    if (cond.some((op) => arrayKeywords.includes(op)) || (defaultSchema.type === 'array' && cond.length === 0)) {
        schema = {
            oneOf: [
                defaultSchema.items || { type: 'array', items: defaultSchema },
                defaultSchema,
            ],
        };
    } else if (cond.includes('$in') || cond.includes('$nin')) {
        schema = {
            oneOf: [
                defaultSchema,
                {
                    type: 'array',
                    items: defaultSchema,
                },
            ],
        };
    } else {
        schema = defaultSchema;
    }

    if (Array.isArray(input)) {
        input = hasError(input, schema);
        return input;
    }
    input = hasError(
        { field: input },
        {
            type: 'object', additionalProperties: false, required: [], properties: { field: schema },
        },
    );
    return input.field;
};

const Parser = (input, compiled, parentLevel) => {
    if ((input && Object.keys(input).length > 0) || Array.isArray(input)) {
        const [cond, level] = parentLevel
            .split('.')
            .reduce(([c, l], s) => (s.startsWith('$') ? [[...c, s], l] : [c, [...l, s]]), [[], []]);

        if (executeableKeywords.includes(cond[ 0 ])) {
            input = hasError(input, Schema);
        } else {
            input = Object.entries(input).reduce((a, [k, v]) => ({
                ...a,
                [ k ]: k.startsWith('$') ? build([...cond, k], level, v) : build(cond, [...level, ...k.split('.')], v),
            }), {});
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

            if (isObject(input[ field ])) {
                const recuredData = { ...acc, [ field ]: recur(input[ field ], `${ level }.${ field }`, field) };
                delete input[ field ];
                return recuredData;
            }

            return acc;
        }, {});
    }

    return Parser(input, compiled, level);
};
const log = recur(update);
console.log(util.inspect(log, { showHidden: false, depth: null, colors: true }));

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
