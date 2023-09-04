let express = require("express");
let router = express.Router();

router.use('/users',require('./user.routes'))
router.use('/job', require('./job-posting.routes'))
router.use('/job', require('./job-Application.routes'))
router.use('/auth', require('./googleAuth.routes'))
router.use('/auth', require('./linkedinAuth.routes'))


module.exports = router;