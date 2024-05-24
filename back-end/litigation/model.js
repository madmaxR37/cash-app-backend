const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');


const LitigationSchema = new Schema({

    userId:{type: Schema.Types.ObjectId, ref:'User'},
    title:{type:String , required:true, maxLength:30},
    description:{type:String , required:true, maxLength:500},
    date:{type:Date, default:Date.now()},
    resolved_status:{type:Boolean, default:false}
});

module.exports = mongoose.model("Litigation", LitigationSchema)