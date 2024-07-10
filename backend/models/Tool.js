const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
    tool_id: {type: Number, required: true, unique: true},
    restriction_id: {type: Number, required: true},
    tool_name: {type: String, required: true},
    tool_model: {type: String, required: true},
    tool_location: {type: String, required: true},
    tool_category: {type: String, required: true},
    imageUrl: {type: String, required: true},
    list_of_trained_students: {type: Array, required: true}, // Array of student IDs
});

toolSchema.statics.getNextToolId = async function () {
    const tool = await this.findOne().sort({tool_id: -1});
    if (!tool) return 1;
    return tool.tool_id + 1;
}

const Tool = mongoose.model('Tool', toolSchema);

module.exports = Tool;