const express =require('express');
const userRouter = express.Router();
const User = require('../models/registrationModel');
// const jwt = require('jsonwebtoken');

//get user details by Email Id

userRouter.post('',function (req, res, next) {
    let user = new User(req.body);
    // const userPayload =
    //     {
    //         "iss": "Identifier of our Authentication Server",
    //         "iat": 1504699136,
    //         "sub": "github",
    //         "exp": 1504699256,
    //         "email": user.emailID
    //
    //     }
    User.findOne({emailID : user.emailID}, function (err, data) {

        if( data != null ) {
            if (user.password == data.password) {
               /* jwt.sign({userPayload}, 'secreteKey', (err, token) => {
                    res.json({message: "Success"}, {token});
                })*/
               console.log({message: "success",userID:data.emailID, userType: data.userType});
                res.json({message: "success",userID:data.emailID, userType: data.userType});
            } else {
                res.json({message:"Invalid credentials"});
            }
        }
        else{
            res.json({message:'User doesnot exists'});
        }
    });
})

module.exports = userRouter;
