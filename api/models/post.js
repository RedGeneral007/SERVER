const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const _ = require('lodash');

const post_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024
  },
  image: {
    type: String,
    minlength: 0,
    maxlength: 1024
  },
  unique_str: {
    type: String,
    required: true,
    length: 62,
    unique: true
  },
  featured_by: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {collection: "posts"});

const Post = mongoose.model('Post', post_schema);


function validate_post(card) {

    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        content: Joi.string().min(2).max(1024).required(),
        image: Joi.string().min(0).max(1024)
    });

  return schema.validate(card);
}


function validate_featured_str (data) {

  const schema = Joi.string().min(62).required();

  return schema.validate(data);
}

async function generate_str(Post) {

  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let random_str = '';

  while (true) {
    random_str = '';
    for (i = 0; i < chars.length; i++) {
      random_str += chars[_.random(0, (chars.length - 1))];
    }
    let post = await Post.findOne({ unique_str: random_str });
    if (!post) return String(random_str);
  }

}

exports.Post = Post;
exports.validate_post = validate_post;
exports.generate_str = generate_str;
exports.validate_featured_str = validate_featured_str;