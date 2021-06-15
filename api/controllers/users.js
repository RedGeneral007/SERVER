const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate_user } = require('../models/user');


module.exports = {
    create_user: async (req, res) => {
        const { error } = validate_user(req.body);
        if (error) return res.status(400).send(error.details[0].message);
      
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('User already registered.');
      
        user = new User(_.pick(req.body, ['name', 'email', 'password', 'posts', 'featured']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
      
    },
    get_my_user: async (req, res) => {

        let user = await User.findOne({_id: req.user._id}).select('-password');

        res.send(user);
    }

}