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
  const ids = value.options.map(opt => opt.id);
  if (new Set(ids).size !== ids.length) {
    return helpers.error("any.custom", { message: "Duplicate option IDs are not allowed" });
  }
  return value;
});

const questionArraySchema = Joi.array().items(questionSchema).max(37).required();

module.exports = {
  questionArraySchema, // ✅ This is what makes it work
};