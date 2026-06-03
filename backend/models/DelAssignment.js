import mongoose from "mongoose";

const deliveryAssignmentSchema=new mongoose.Schema({
    order:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Shop"
    },
    shoporderId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    brodcastedTo:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    status:{
        type:String,
        enum:['broadcasted','assigned','completed'],
        default:'broadcasted'
    },
    acceptedAt: Date,
},{timestamps:true})
const DelAssignment = mongoose.model("DelAssignment", deliveryAssignmentSchema);
export default DelAssignment;