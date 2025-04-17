module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: "Validation failed",
                details: error.details.map((e) => e.message),
            });
        }

        next();
    };
};

// This is a generic Joi validation middleware
module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((e) => e.message),
      });
    }
    next();
  };
};