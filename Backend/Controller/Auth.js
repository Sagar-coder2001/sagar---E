const { generateToken } = require("../jwt");
const { User } = require("../Model/User");

exports.createUser = async (req, res) => {
  try {
    // const existingUser = await User.findOne({ email: req.body.email });
    
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Email already exists' });
    // }

    const user = new User(req.body);
    const doc = await user.save();

    const token = generateToken(doc);

    res.status(200).json({ response: doc, token });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
   const ismatch = await user.comparePassword(password)
   if(!ismatch){
     return res.status(401).json({ message: 'Invalid email or password' })
   }
   const token = generateToken({id: user.id , email: user.email, role: user.role})
   
    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token:token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
