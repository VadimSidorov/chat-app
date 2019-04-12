const express = require('express');
const checkAuth = require('../middleware/check-auth');
const postControllers = require('../controllers/posts');
const extractFile = require('../middleware/multer-middleware');



const router = express.Router();


router.post('', checkAuth, extractFile, postControllers.createPost )
router.put("/:id", checkAuth, extractFile, postControllers.updatePost)
router.get("", postControllers.getPosts );
router.get("/:id", postControllers.getPost)
router.delete("/:id", checkAuth, postControllers.deletePost )

module.exports = router;
