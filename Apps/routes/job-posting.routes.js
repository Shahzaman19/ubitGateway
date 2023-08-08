const express = require('express')
const router = express.Router()
const controller = require('../controllers/job-posting.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')
const {upload} =  require('../utils/multerConfig')


router.post('/posting',upload.single('img'), controller.jobPost);
router.get('/getPosts', controller.getJobPosts);
router.get('/getPost', controller.getJobPost);
router.delete('/deletePost', [authMiddleware], [admin],    controller.deleteJobPosts);
router.get('/filtered-jobs', controller.getFilteredJobs);

module.exports = router;