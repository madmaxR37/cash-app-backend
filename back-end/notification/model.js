const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
                
    userId: {type:Schema.Types.ObjectId, ref:'User'},
    title:  {type: String, maxLength:100},
    description: {type:String, required:true,moinLength:10,maxLength:500},
    date:{type:Date, default:Date.now},
    opened: {type:Boolean, default:false}
});

module.exports = mongoose.model("Notification", NotificationSchema);