const router = require('express').Router();

// include each route handler
let {createPost} = require('./createPost');
let {listAllPosts, listValidPosts, getPostbyID} = require('./getPosts');
let {updatePost} = require('./updatePost')


router.post('/createPost', createPost);
router.get('/listAllPosts', listAllPosts);
router.get('/listValidPosts', listValidPosts);
router.get('/getPostbyID', getPostbyID);
router.post('/updatePost', updatePost);

//test routes
// let {updatePostUnauthorized} = require('./updatePost')
// router.post('/updatePostUnauthorized', updatePostUnauthorized);


// return the above routes
module.exports = router;
