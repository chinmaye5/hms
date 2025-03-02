const User = require('../models/User');

exports.register = async (userData) => {
  return await User.create(userData);
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

exports.getUser = async (id) => {
  return await User.findById(id);
};
