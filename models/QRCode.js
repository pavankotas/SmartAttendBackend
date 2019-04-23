const mongoose =require('mongoose');
const QRSchema = new mongoose.Schema({
    qrCode:{
        type: String,
        unique: true,
        required: [true, 'QR Code cannot be left blank'],
        trim: true
    },
    status:{
        type: String,
        default: false,
        required: [true, 'Status cannot be left blank'],
    },
    createdBy: {
        type: String,
        required:  [true, 'Email address cannot be left blank'],
        trim:true
    },
    userType:{
        type: String
    },
    createdOn:{
        type: Date
    }

});

/*Register UserSchema object insdie the mongoose*/
const QRCode =mongoose.model('QRCode', QRSchema);
module.exports = QRCode;
