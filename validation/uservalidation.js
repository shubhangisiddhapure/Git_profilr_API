const Joi = require('@hapi/joi')


function validateObj(obj, schema) {
    let result = null
    Joi.validate(obj, schema, (err, data) => {
        if (err) {
            result = [false, err]
        }
        else {
            result = [true, data]
        }
    })
    return result
}

function userValidation(user) {
  
    const UserSchema = Joi.object().keys({
   
    name: Joi.string().required(true), 
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:Joi.string().required(true),
    avatar:Joi.string().optional(),
    date: Joi.date().optional()
    })
    return validateObj(user,UserSchema)
}

module.exports = {
    userValidation: userValidation,
}
