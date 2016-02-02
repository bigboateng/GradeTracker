// load all the things needed
var path = require('path');


var LocalStrategy = require('passport-local').Strategy;
// load up the user model

var User = require(path.resolve(__dirname, './User.js'));

// expose this function to our app 

module.exports = function(passport)
{
	// used to serialize user for session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	// deserialize user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	// local signup
	passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
		passReqToCallback: true
	},

	function(req, username, password, done)
	{
		//asynchronous
		process.nextTick(function(){
		// find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({'secret.username': username}, function(err, user){
        	if(err) return done(err);
        	if(user)
        	{
        		return done(null, false, req.flash('signupMessage', "'" + username+"'" + ' is already registered'));
        	} else 
        	{
        		// if there is no user with that email
        		// create the user
        		var newUser = new User();

        		// set their contents
        		newUser.secret.username = username;
        		newUser.secret.password = newUser.generateHash(password);
        	

        		// save the new user

        		newUser.save(function(err)
        		{
        			if(err) throw err;
        			return done(null, newUser);
        		});
        	}
        });
    });
	}
	));

passport.use('local-signin', new LocalStrategy({
	passReqToCallback: true
},


function(req, username, password, done){



	User.findOne({ 'secret.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
            	return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

}
));






}