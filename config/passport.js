var User = require('User.js');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport)
{
	// serialize user
	passport.serializeUser(function(user){
		return done(err, user.id);
	});

	// deserialize user
	passport.deserializeUser(function(id){
		User.findById(id, function(err, user){
			done(err, user);
		});
		return done(null, user);
	});

	// local sign up
	passport.use('local-signup', new LocalStrategy({
		{
			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done){
			//asynchronous
			// check to see if user already exists
			User.fineOne({'secret.username':username}, function(err, user){
				if(err) return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', "'"+username +"'"+ "u is already registered user."))
				}else{
					// user does not exist, create new user
					var newUser = User();

					// set their contents
					newUser.secret.email = req.body.email;
					newUser.secret.username = username;
					newUser.secret.password = newUser.generateHash(password);

					// save the user
					newUser.save(function(err){
						if(err) throw err;
						return done(null, newUser, req.flash('firstLogonMessage', 'Welcome! ' + newUser.secret.username));
					});
				}
			});
		}
	}));

	// local sign-in
	passport.use('local-signin', new LocalStrategy({
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done)
		{
			User.findOne({'secret.username':username}, function(err, user){
				// if there was an error
				if(err) return done(err);

				// if user is not found
				if(!user){
					return done(null, false, req.flash('loginMessage', "No user was found!"));
				}

				// if the user is found but password is wrong
				if(!user.validPassword(password)){
					return done(null, false, req.flash('loginMessage', "Oops, wrong password"));
				}

				// all is good, return user
				done(null, user);
			});
		}
	}));


}