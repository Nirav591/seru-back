const Joi = require("joi");

const optionSchema = Joi.object({
  id: Joi.number().required(),
  option: Joi.string().required(),
  isAnswer: Joi.boolean().required(),
});

const questionSchema = Joi.object({
  id: Joi.number().required(),
  question: Joi.string().required(),
  type: Joi.string().valid("SINGLE", "MULTIPLE", "FILL_BLANK").required(),
  noOfAnswer: Joi.number().min(1).required(),
  options: Joi.array().items(optionSchema).min(1).required(),
}).custom((value, helpers) => {
  // Check for duplicate option IDs
  const optionIds = value.options.map(opt => opt.id);
  const uniqueIds = new Set(optionIds);
  if (optionIds.length !== uniqueIds.size) {
    return helpers.error("any.custom", { message: "Duplicate option IDs are not allowed" });
  }
  return value;
}, "Option ID Uniqueness Validation");

const questionsArraySchema = Joi.array().items(questionSchema).min(1).required();

module.exports = {
  questionsArraySchema,
};