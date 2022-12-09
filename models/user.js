var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
require('mongoose-type-email');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: mongoose.SchemaTypes.Email, required: true, unique: true},
    type: {type: String},
    department: {type: String},  
    dateAdded: {type: Date}

});

UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);