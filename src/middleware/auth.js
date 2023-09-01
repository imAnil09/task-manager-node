const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    // console.log('hitted middleware!');

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismypassword');
        const user = await User.findOne({_id: decoded._id, "tokens.token": token});
        // res.send
        // console.log(token);
        // console.log(decoded);

        if(!user){
            throw new Error();
        }
        
        req.user = user;

        next()
        
    }
    catch {
        res.status(401).send({error: 'Please authenticate'});
    }
    
    // next();
}

module.exports = auth;