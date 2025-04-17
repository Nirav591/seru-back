const Joi = require("joi");

exports.chapterSchema = Joi.object({
  title: Joi.string().required(),
  index_number: Joi.number().required(),
  content: Joi.string().allow("", null), // content is optional HTML
});