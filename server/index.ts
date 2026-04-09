import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/recipe', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      messages,
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/swag', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages,
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
