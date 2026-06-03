import mongoose from "mongoose";
const Userschema = new mongoose.Schema({
    name : {type: String , required : true},
    email : {type: String , required : true , unique : true},
    password : {type: String},
    mobile : {type: String, required : true},
    role : {
        type: String,
        enum: ['user', 'admin','deliveryBoy'],
        default: 'user'
    },
    resetOtp: { type: String },
    isOtpVerified: { type: Boolean, default: false },
    otpExpiry: { type: Date },
    socketId: { type: String, default: null },
    isOnline: { type: Boolean, default: false },
    location:{
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        default: [0, 0]
    }
}
},

{timestamps: true}
); 
Userschema.index({ location: "2dsphere" });

const User = mongoose.model('User' , Userschema ) ;

export default User