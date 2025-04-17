const Joi = require('joi');

const chapterSchema = Joi.object({
    title: Joi.string().required(),
    index_number: Joi.number().required(),
    content: Joi.string().required(),
});

module.exports = { chapterSchema };