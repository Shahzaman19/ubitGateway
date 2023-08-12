const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller')
const authMiddleware = require('../middleware/authMiddleware')
const admin =  require('../middleware/admin')
const { upload } = require('../utils/multerConfig')


//ROUTES
router.post('/create',upload.single('img'), controller.create)
router.post('/login' , controller.login)
router.get('/getAllUsers', [authMiddleware] , [admin], controller.get)
router.get('/getSingleUser' ,[authMiddleware], controller.getSingleUser)
router.post('/forgetPassword' , controller.forgetPassword)
router.post('/resetPassword' , controller.resetPassword)
router.post('/verifyOtp' , controller.verifyOtp)
router.post('/verification' , controller.verification)
router.put('/edit' , [authMiddleware] ,upload.single('img'), controller.edit)
router.delete('/delete' , [authMiddleware] , [admin], controller.delete)
router.post('/experience' , [authMiddleware] ,  controller.experience)
router.put('/updateExperience' , [authMiddleware] ,  controller.updateExperience)
router.post('/education' , [authMiddleware] ,  controller.education)
router.put('/updateEducation' , [authMiddleware] ,  controller.updateEducation)
router.post('/personalDetails' , [authMiddleware] ,upload.single('picture'),  controller.personalDetails)
router.put('/updatePersonalDetails' , [authMiddleware] ,upload.single('picture'),  controller.updatePersonalDetails)
router.post('/resumeDetails' , [authMiddleware] ,upload.single('resume'), controller.resumeDetails)
router.put('/updateResumeDetails' , [authMiddleware] ,upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'portfolio', maxCount: 5 }
  ]),  controller.updateResumeDetails)
router.get('/limitedDetails' , [authMiddleware] ,upload.single('resume'),  controller.getLimitedUserDetails)





module.exports = router;