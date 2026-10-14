import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Conversational and Explanation API
app.post('/api/ai/explain', async (req, res) => {
  const { question, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      source: 'fallback',
      response: null,
      message: 'GEMINI_API_KEY not configured. Using deterministic procurement logic.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the Evaluation & Award Agent in the Autonomous Sourcing Agent platform (JAGGAER ecosystem).
Buyer Question: "${question}"

Sourcing Context:
${JSON.stringify(context, null, 2)}

Provide a concise, direct, defensible procurement explanation.
Guidelines:
1. Always give the exact figures and math (e.g. price per unit, total price difference, point spread).
2. Detail compliance checks and delivery dates.
3. Keep the tone professional, objective, audit-defensible, and concise (under 120 words).
4. Never make up unverifiable data; use the exact supplier quotes provided in the context.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });

    res.json({
      source: 'gemini',
      response: response.text,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/ai/explain:', error);
    res.status(200).json({
      source: 'fallback',
      response: null,
      error: error.message || 'Gemini error',
    });
  }
});

// Natural language requirement intake API
app.post('/api/ai/intake', async (req, res) => {
  const { userPrompt, historicalPOs, categories } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ source: 'fallback', parsed: null });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the Intake & Policy Agent in the Autonomous Sourcing Agent platform.
User input: "${userPrompt}"

Available Categories: ${JSON.stringify(categories)}
Recent Historical POs: ${JSON.stringify(historicalPOs)}

Extract in strict JSON:
{
  "item": "string",
  "quantity": number,
  "unit": "string",
  "targetDeliveryDate": "string",
  "deliveryLocation": "string",
  "estimatedBudget": number,
  "matchedCategory": "string",
  "unspscCode": "string",
  "isTailSpend": boolean,
  "policyCheck": "string",
  "historicalMatch": "string or null"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json({
      source: 'gemini',
      parsed: JSON.parse(response.text || '{}'),
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/ai/intake:', error);
    res.status(200).json({ source: 'fallback', parsed: null });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Sourcing Agent running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
