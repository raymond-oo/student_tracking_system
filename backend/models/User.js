const mongoose = require('mongoose');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true, primary: true },
  google_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  grade: { type: String },
  is_admin: { type: Boolean, default: false },
  list_of_trained_tools: { type: [String] },
  profile_image: { type: String },
});

userSchema.statics.getNextUserId = async function () {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'userIdCounter' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
