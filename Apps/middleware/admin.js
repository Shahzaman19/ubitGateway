module.exports = async (req, res, 
    next) => {
    if(req.user.userRole !== 'admin' ){
        return  res.status(403).send('Access denied. Only admin can access')
    }
    else{
        next()
    }
}