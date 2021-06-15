const express = require('express');
const router = express.Router();

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');

router.post('/', async (req, res) => {

  const { error } = validate_user_schema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Wrong email or password.');

  const valid_pwd = await bcrypt.compare(req.body.password, user.password);
  if (!valid_pwd) return res.status(400).send('Wrong email or password.');

  res.send({ token: user.generate_auth_token() });

});

function validate_user_schema(req) {

  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  });

  return schema.validate(req);
}

module.exports = router;