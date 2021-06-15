const router = require('express').Router();
const auth = require('../middleware/auth');

const {
    create_user,
    get_my_user,
} = require('../controllers/users');


router.post('/', create_user);
router.get('/me', auth, get_my_user);


module.exports = router;