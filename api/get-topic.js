require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

module.exports = async (req, res) => {
    const { topic } = req.query;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const prompt = `Provide a concise definition for the word "${topic}". The definition should be no more than five sentences long.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        res.status(200).json({ content: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to get topic from Gemini API' });
    }
};
