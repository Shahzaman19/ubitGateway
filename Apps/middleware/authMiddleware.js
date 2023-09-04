const jwt = require('jsonwebtoken')
module.exports = function (req,res,next){
    const token = req.headers.authorization
    if(!token) return  res.status(404).send('Access denied . No token provided')

    try {
        // eslint-disable-next-line no-undef
        const decoded = jwt.verify(token,process.env.PRIVATE_KEY)
        req.user = decoded;
        next()    
        } 
        catch (error) 
        {
            return res.status(400).send('Invalid token')
        }
}