const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    tool_id: {type: Number, required: true, unique: true},
    restriction_id: {type: Number, required: true},
    tool_name: {type: String, required: true},
    tool_model: {type: String, required: true},
    tool_location: {type: String, required: true},
    tool_category: {type: String, required: true},
    imageUrl: {type: String, required: true},
    list_of_trained_students: {type: Array}, // Array of student IDs
}, { timestamps: true });

toolSchema.statics.generateUniqueId = function() {
    return crypto.randomInt(0, 999999).toString().padStart(6, '0');
};


const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;