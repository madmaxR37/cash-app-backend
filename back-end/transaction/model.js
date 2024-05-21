const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    senders_id : {type: Schema.Types.ObjectId, ref:'User'},
    receivers_id: {type: Schema.Types.ObjectId, ref:'User'},
    amount : {type:Number, required:true},
    status:{type:Boolean, default:false},
    created: {type:Date, default:Date.now},
    transaction_type:{type:String, enum:["ENVOIE","RECEPTION"]}
})