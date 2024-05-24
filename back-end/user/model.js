const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength:100},
    last_name: {type:String, require: true, maxLength:100},
    date_of_birth:{type:Date},
    address: { city:String, quarter:String, Country:String},
    email: {type:String, required:true, unique:true},
    phone_number: {type:String, required:true, unique:true},
    password: String,
    pin:{type: String, required:true},
    wallet:{name:String, account_balance:{type:mongoose.SchemaTypes.Decimal128, default:0.0},
        currency:{type:String, enum:["XAF"],default:"XAF"}},
    role:{name:{type: String, require:true, enum:["USER", "ADMIN"], default:"USER"}},
    profile: String,
    created: {type:Date, default:Date.now},
    contacts:[{type:mongoose.SchemaTypes.ObjectId, ref:'Contact'}]
});

module.exports = mongoose.model("User", UserSchema);