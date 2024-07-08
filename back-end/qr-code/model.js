const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QRSchema = new Schema({
    url: String,
    userId:{type:mongoose.SchemaTypes.ObjectId, ref:'User'}
});

module.exports = mongoose.model("QR", QRSchema);