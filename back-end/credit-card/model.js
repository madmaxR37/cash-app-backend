const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CreditCardSchema = new Schema({
           name:{type:String},
           brand:String,
           number:{type:String},
           expDate:{type:String},
           cvv:{type:String},
           userId:{type:mongoose.SchemaTypes.ObjectId, ref:"User"}
});

module.exports = mongoose.model("CreditCard", CreditCardSchema);