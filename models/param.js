var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    clockin: {type: String, required: true},
    clockout: {type: String, required: true},
    earlyclockin: {type: String, required: true},
    earlyclockout: {type: String, required: true},
    jamlembur: {type: String, required: true},

});


module.exports = mongoose.model('Parameter', UserSchema);