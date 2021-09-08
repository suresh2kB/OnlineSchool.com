const Joi = require('joi');

module.exports.studentSchema = Joi.object({
  student: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string().required(),
    class: Joi.number().required().min(0),
    description: Joi.string().required(),
    fees: Joi.number().required().min(0),
  }).required(),
});
