const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactSchema = new Schema({

    first_name:String,
             last_name: String,
             email:String,
             phone:String,
             profile:String,
             userId:{type:mongoose.SchemaTypes.ObjectId, ref:'User'}
});

module.exports = mongoose.model("Contact", ContactSchema);