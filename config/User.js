var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	secret:{
		username: String,
		email: String,
		password: String
	}
});

// generating hash for password
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// unhashing
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.secret.password);
}

var User = mongoose.model('User',userSchema);

module.exports = User;