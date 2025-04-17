const Joi = require('joi');

const examTestSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    duration: Joi.number().integer().min(1).required(), // Duration in minutes
    totalQuestions: Joi.number().integer().min(0).optional(), 
});

module.exports = { examTestSchema };