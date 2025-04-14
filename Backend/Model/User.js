
const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default:'user' },
  address: { type: [Schema.Types.Mixed] }, 
  // for addresses, we can make a separate Schema like orders. but in this case we are fine
  name: { type: String },
  // salt: Buffer,
  // resetPasswordToken: {type: String, default:''}
})

const virtual = userSchema.virtual('id')
virtual.get(function() {
    return this._id;
})
 
userSchema.set('toJSON' , {
    virtual : true,
    versionKey: false,
    transform : function (doc , ret) { delete ret._id}
})

userSchema.pre('save' , async function(next) {
  const user = this
  if(!user.isModified('password')){
   return next();
  }
  try{
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    next();
  }
  catch(err){
    console.log(err)
  }

})

userSchema.methods.comparePassword = async function(password) {
  try{
    return await bcrypt.compare(password , this.password)
  }
  catch(err){
    console.log(err)
  }
}

exports.User = mongoose.model('User' , userSchema)