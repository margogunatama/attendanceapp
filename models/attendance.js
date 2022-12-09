var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttendanceSchema = new Schema({

    employeeID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    year: {type: Number, required: true},
    month: {type: Number, required: true},
    date: {type: Number, required: true},
    waktumasuk: {type: String, required:true},
    waktupulang: {type: String, required:true},
    present: {type: Boolean, required: true},
    keterangan: {type: String},
});


module.exports = mongoose.model('Attendance', AttendanceSchema);