// examQuestionValidators.js
const Joi = require('joi');

const optionSchema = Joi.object({
  option_text: Joi.string().required(),
  isAnswer: Joi.boolean().required()
});

const examQuestionSchema = Joi.object({
  exam_test_id: Joi.number().required(),
  question: Joi.string().required(),
  type: Joi.string().required(),
  noOfAnswer: Joi.number().required(),
  options: Joi.array().items(optionSchema).required()
});

module.exports = { examQuestionSchema };
