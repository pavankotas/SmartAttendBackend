const express =require('express');
const userRouter = express.Router();
const User = require('../models/registrationModel');



// GET route for reading data
userRouter.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/src/app/app.component.html'));
});


//POST route for updating data
userRouter.post('/', function (req, res, next) {
    let user = new User(req.body);
    user.userType = 'student'
    User.create(user)
        .then(user => {
            res.status(200).json({'Result': 'User added successfully'});
        })
        .catch(err => {
            console.log("Cannot add user");
            res.status(400).send(err);
        });
})

module.exports = userRouter;
