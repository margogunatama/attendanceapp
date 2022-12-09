var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LemburSchema = new Schema({

    applicantID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    tujuanlembur: {type: String, required: true},
    appliedDate: {type: Date, required: true},
    jammulailembur: {type: String, required: true},
    jamselesailembur: {type: String, required: true},
    tipehari: {type: String, required: true},
    adminResponse: {type: String, default: 'N/A'},

});


module.exports = mongoose.model('Lembur', LemburSchema);