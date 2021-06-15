const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

const {
    create_post,
    get_all_posts,
    get_post,
    delete_post,
    update_post,
    add_featured,
    get_all_my_featured,
    delete_from_featured,
    get_my_posts
} = require('../controllers/posts');


router.post('/', auth, upload.single('image'), create_post);
router.get('/', auth, get_all_posts);
router.get('/my', auth, get_my_posts);

router.get('/featured', auth, get_all_my_featured);
router.post('/featured/:id', auth, add_featured);
router.delete('/featured/:id', auth, delete_from_featured);

router.get('/:id', auth, get_post);
router.delete('/:id', auth, delete_post);
router.put('/:id', auth, upload.single('image'), update_post)


module.exports = router;