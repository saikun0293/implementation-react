const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./DB/user')

 function initialize(passport){
    const authenticateUser = async(email, password, done) => {
        User.findOne({$or: [{'email': email}, {'username': email}]})
        .then( async user => {
            if(!user){
                return done(null, false, { message: "No user with that email"})
            }

            if(!user.active) {
                console.log(user + "ege");
                return done(null, false, { message: "Please Verify your Email First" })
            }

            try {
                if(await bcrypt.compare(password, user.password)) {
                    console.log("User Logging in.." )
                return done(null, user)
                }
                else {
                    return done(null, false , { message: "Password Incorrect"})
                }
            } catch(e) {
                return done(e)
            }
        })
    }
    passport.use(new LocalStrategy({ 
        usernameField: 'email',
        passwordField: 'password'}, 
        authenticateUser
        ))

    passport.serializeUser((user, done) => { done(null,user._id) })
    passport.deserializeUser( async (id, done) => { done(null, User.findById(id)) 
})
}

module.exports = initialize