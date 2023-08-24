const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const tasksRouter = require('./routers/tasksRouter');
const jwt = require('jsonwebtoken');
// const bcryptjs = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;


// This is a Express middleware function to stop some where, process some work and after that it'll get executed
app.use((req, res, next) => {
    const methods = ['GET', 'POST', 'PATCH', 'DELETE']
    if( methods.includes(req.method)){
        res.status(503).send('The Server is under Maintanance. Please visit after some time!')
    }
    else {
        next()
    }
})


app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log(`Server started at ${port} port`)
})

// const myFunction = async () => {
//     // const token = jwt.sign({_id: 'anilanil233'}, 'thisismypassword', {expiresIn: '1 days'})
//                                 // payload             secret Signature     can provide expiration
//     const token = jwt.sign({_id: 'anilanil233'}, 'thisismypassword', {expiresIn: '1 days'})
    
//     console.log(token, 'This is token')
    
//     const data = jwt.verify(token, 'thisismypassword', )
    
//     console.log(data, 'This is data')

// const token = jwt.sign({_id : 'heyAnil'}, 'thisismypassword')
// const data = jwt.verify(token, 'thisismypassword')
// console.log(token)
// console.log(data)

// }

// myFunction();