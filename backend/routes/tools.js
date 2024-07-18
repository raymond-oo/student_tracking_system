const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const verifySession = require('../middleware/verifysession');

// Get all tools
router.get('/', verifySession, async (req, res) => {
    try {
        const tools = await Tool.find();
        res.json(tools);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single tool
router.get('/:id', verifySession, async (req, res) => {
    try {
        const tool = await Tool.findById(req.params.id);
        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.json(tool);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new tool
router.post('/', verifySession, async (req, res) => {
    let toolData = req.body;
    if (!toolData.tool_id) {
        toolData.tool_id = Tool.generateUniqueId();
    }
    
    const tool = new Tool(toolData);

    try {
        const newTool = await tool.save();
        res.status(201).json(newTool);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a tool
router.put('/:id', verifySession, async (req, res) => {
    try {
        const updatedTool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTool);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a tool
router.delete('/:id', verifySession, async (req, res) => {
    try {
        await Tool.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tool deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;