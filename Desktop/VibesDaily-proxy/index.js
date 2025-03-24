const express = require('express');
const { OpenAI } = require('openai');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    next();
});

const client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseUrl: 'https://api.x.ai/v1',
});

app.post('/api/horoscope', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const completion = await client.chat.completions.create({
            model: 'grok-2-latest',
            messages: [
                { role: 'system', content: 'You are a cosmic guide providing detailed horoscopes.' },
                { role: 'user', content: prompt }
            ],
            stream: false,
            temperature: 0,
            max_tokens: 200
        });

        res.json({ content: completion.choices[0].message.content });
    } catch (error) {
        console.error('xAI API Error:', error.message, error.response?.data);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on port ${port}`)); 
