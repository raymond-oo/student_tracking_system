const mongoose = require('mongoose');
const crypto = require('crypto');
const Tool = require('./Tool');

const userSchema = new mongoose.Schema({
  user_id: { type: String, unique: true, required: true },
  google_id: { type: String },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  grade: { type: String },
  is_admin: { type: Boolean, default: false },
  list_of_trained_tools: { type: [Tool.schema] },
  profile_image: { type: String },
  session: { type: String },
}, {timestamps: true});

userSchema.statics.generateUniqueId = function() {

  const randomStr = crypto.randomInt(0, 999999).toString().padStart(6, '0');
  return randomStr;
  
};

const User = mongoose.model('User', userSchema);

module.exports = User;