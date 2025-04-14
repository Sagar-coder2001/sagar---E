const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./Model/User');

const localstratergy = () => {
    passport.use(new LocalStrategy(async (email, password, done) => {
        try{
            const user = await User.findOne({email: email})
            if(!user){
              return done(null, false, {message: 'Incorrect username'})
            }
            const ismatched = await user.comparePassword(password)
             if(!ismatched){
              return done(null, false, {message: 'Incorrect password'})
            }
            return done(null, user)
          }
        catch(err){
            done(err)
        }
    }))
}

module.exports = localstratergy;