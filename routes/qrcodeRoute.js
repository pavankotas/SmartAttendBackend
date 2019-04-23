const express =require('express');
const qrRouter = express.Router();
const QRCode = require('../models/QRCode');
const Attendance  = require('../models/Attendance');

var returnRouter = function(io , users) {

    qrRouter.post('/add',function (req, res, next) {
        let qrcode = new QRCode(req.body);
        qrcode.createdOn = new Date();
        qrcode.userType = 'admin';
        qrcode.status= 'active';
        console.log(qrcode);

        QRCode.updateMany({ status : "active" }, { $set: { status: 'inactive' }}, { multi: true }, function(){
            QRCode.create(qrcode)
                .then(user => {
                    res.status(200).json({'Result': 'Qr Code added successfully'});
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send(err);
                });
        });

    });

// Method to mark attendance to student
    qrRouter.post('/checkin', function (req, res, next) {


        console.log("Check Requested");

        let attendance = new Attendance(req.body);

        console.log(attendance);

        let qrCode = new QRCode();


        // If Active QR Code
        QRCode.findOne({ qrCode : attendance.qrCode }, function (err, data) {

            if (err){
                console.log(err);
                res.status(400).json({'message': 'There is some internal issue. Please try after some time.'});

            }

            console.log(data);
            qrCode = data;
            if(qrCode.status == 'active') {

                attendance.createdOn = new Date();
                Attendance.create(attendance)
                    .then(user => {
                        console.log("testiong");
                        console.log(users);
                        io.sockets.in(users[qrCode.createdBy]).emit('Message', {event:'regenerate'})
                        res.status(200).json({'message': 'Checked in successfully'});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({'message': 'There is some internal issue. Please try after some time.'});;
                    });
            }
            else{

                res.status(200).json({message:'Please scan the QR Code again.'});
            }
        });


    });


    qrRouter.get('/adminreport',function (req, res, next) {

        Attendance.aggregate([

            {"$group": {
                    "_id": {
                        "$subtract": [
                            { "$subtract": [ "$createdOn", new Date("1970-01-01") ] },
                            { "$mod": [
                                    { "$subtract": [ "$createdOn", new Date("1970-01-01") ] },
                                    1000 * 60 * 60 * 24
                                ]}
                        ]
                    },
                    attendedStudents:{$sum: 1 }
                }
            },
            {
                $project: {
                    "date": "$_id",
                    attendedStudents: 1,
                    "_id": 0
                }
            }

            ], function (err, data) {

            for(var obj in data){
                data[obj].date = (new Date(data[obj].date)).toISOString().split('T')[0];
                data[obj].totalStudents = 20;

            }
            res.json(data);
        });

    });




    qrRouter.get('/studentreport/:id',function (req, res, next) {

       Attendance.find({studentEmailID:req.params.id}, {'_id':0, 'createdOn':1}, function (err, data) {

           var dates = [];

           for(var obj in data){
               dates.push((new Date(data[obj].createdOn)).toISOString().split('T')[0]);
           }

           res.json(dates);
       });

    });


    return qrRouter;

}

module.exports =  returnRouter;

