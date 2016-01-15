var Schema = require('mongoose').Schema;

var userSchema = new Schema({
	local:{
		username: String,
		pass: String,
	}
});

