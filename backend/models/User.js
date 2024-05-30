const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    google_id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    grade: { type: String },
    is_admin: { type: Boolean, default: false },
    list_of_trained_tools: { type: [String] },
    profile_image: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;