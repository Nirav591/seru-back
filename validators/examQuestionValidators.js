const Joi = require('joi');

const optionSchema = Joi.object({
    option: Joi.string().required(),
    isAnswer: Joi.boolean().required(),
});

const examQuestionSchema = Joi.object({
    exam_test_id: Joi.number().required(),
    question: Joi.string().required(),
    type: Joi.string().valid('fill_in_blank', 'multiple_choice', 'true_false').required(),
    noOfAnswer: Joi.number().required(),
    options: Joi.array().items(optionSchema).required(),
});

module.exports = { examQuestionSchema };