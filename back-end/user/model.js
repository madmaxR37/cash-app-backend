const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength:100},
    last_name: {type:String, require: true, maxLength:100},
    date_of_bith:{type:Date},
    address: { city:String, quarter:String, Country:String},
    email: String,
    phone_number: String,
    password: String,
    role:{name:{type: String, require:true, enum:["USER", "ADMIN"], default:"USER"}},
    profile: String
});

module.exports = mongoose.model("User", UserSchema);