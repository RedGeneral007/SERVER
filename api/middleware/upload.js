const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
})

const file_filter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        callback(null, true);
    }
    callback(null, false);
}

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    file_filter
});


module.exports = upload;