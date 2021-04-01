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

function profileValidation(user) {
  
    const ProfileSchema = Joi.object().keys({
    company:Joi.string().optional(),
    webSite:Joi.string().optional(),
    bio:Joi.string().optional(),
    location:Joi.string().optional(),
    githubusername:Joi.string().optional(),
    status: Joi.string().required(true), 
    skills:Joi.string().required(true),
    experience:Joi.string().optional()
    })
    return validateObj(user,ProfileSchema)
}

module.exports = {
    profileValidation: profileValidation,
}
