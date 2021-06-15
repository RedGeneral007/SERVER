const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const user_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
}, {collection: "users"});


user_schema.methods.generate_auth_token = function () {
  const token = jwt.sign({ _id: this._id, name: this.name }, config.get('jwt_key'));
  return token;
}


function validate_user (user) {
    const user_schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(2).max(1024).required(),
    });

    return user_schema.validate(user);
}


module.exports = {
    User: mongoose.model("User", user_schema),
    validate_user
}