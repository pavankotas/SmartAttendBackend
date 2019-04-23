const mongoose =require('mongoose');
const AttendanceSchema = new mongoose.Schema({
    studentEmailID:{ // This is student email id
        type: String,
        required: [true, 'Student ID cannot be left blank'],
        trim: true
    },
    courseID:{ // This is course id
        type: String,
        required: [true, 'Class ID cannot be left blank'],
    },
    qrCode:{
        type: String,
        required:[true, 'QR Code cannot be left blank'],
    },
    createdOn:{
        type: Date
    }

});

const Attendance =mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
