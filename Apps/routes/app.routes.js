let express = require("express");
let router = express.Router();

router.use('/users',require('./user.routes'))
router.use('/job', require('./job-posting.routes'))
router.use('/job', require('./job-Application.routes'))


module.exports = router;