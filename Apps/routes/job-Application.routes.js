const express = require('express')
const router = express.Router()
const controller = require('../controllers/job-Application.controller')
const authMiddleware = require('../middleware/authMiddleware')
const { upload } =  require('../utils/multerConfig')

router.post('/application', [authMiddleware], upload.single('resume'), controller.post);
router.get('/application/count' , [authMiddleware] ,controller.getJobApplicationCount);
router.get('/getAllJobs' , [authMiddleware] ,controller.getAllJobsByEmployer);
router.get('/getJobApplicants' , [authMiddleware] ,controller.getJobApplicants);
router.get('/getJobDetails'  ,controller.getJobDetails);





module.exports = router;