const multer = require('multer');

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, '/tmp/thumb');
  // },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
// filename

const upload = multer({ storage: storage });

module.exports = { multer: upload };
