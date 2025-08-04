require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// --- Initialize Gemini ---
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        serveStaticFile(res, 'src', 'index.html');
    } else if (req.url === '/style.css' && req.method === 'GET') {
        serveStaticFile(res, 'src', 'style.css');
    } else if (req.url === '/app.js' && req.method === 'GET') {
        serveStaticFile(res, 'src', 'app.js');
    } else if (req.url.startsWith('/api/get-topic') && req.method === 'GET') {
        handleApiRequest(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function serveStaticFile(res, ...filePathParts) {
    const fullPath = path.join(__dirname, ...filePathParts);
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error loading ${path.basename(fullPath)}`);
        } else {
            let contentType = 'text/plain';
            if (fullPath.endsWith('.html')) {
                contentType = 'text/html';
            } else if (fullPath.endsWith('.css')) {
                contentType = 'text/css';
            } else if (fullPath.endsWith('.js')) {
                contentType = 'application/javascript';
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

async function handleApiRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const topic = url.searchParams.get('topic');

    if (!topic) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Topic is required' }));
        return;
    }

    try {
        const prompt = createPrompt(topic);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: text }));

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to get topic from Gemini API' }));
    }
}

function createPrompt(topic) {
    return `Provide a concise definition for the word "${topic}". The definition should be no more than five sentences long.`;
}


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
