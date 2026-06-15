import express from 'express';
import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// 1. Contact Form Transceiver Endpoint
apiRouter.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Received transceiver signal from ${name} (${email}): ${message}`);

  const resendKey = process.env.RESEND_KEY;
  if (!resendKey || resendKey === 'placeholder_key') {
    console.warn('RESEND_KEY is not configured on backend. Mocking successful signal transmission.');
    return res.json({ success: true, message: 'Transceiver signal logged successfully (Mock Mode).' });
  }

  try {
    const resend = new Resend(resendKey);
    // onboarding@resend.dev is standard for unverified domain accounts
    const recipient = process.env.CONTACT_EMAIL || 'yourmail@gmail.com';
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: recipient,
      subject: `Quest Transceiver: Signal from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: 'Transceiver signal logged successfully.' });
  } catch (err: any) {
    console.error('Transceiver Mailer Error:', err);
    res.status(500).json({ error: err.message || 'Failed to log transceiver signal.' });
  }
});

// 2. Gemini Prompt Scroll Matrix Generator Endpoint
apiRouter.post('/gemini', async (req, res) => {
  const { scenario, tone } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'placeholder_key') {
    return res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the backend.' });
  }

  const getToneName = (t: string) => {
    switch (t) {
      case 'cyberpunk': return 'Neo-Cyberpunk';
      case 'eldritch': return 'Gothic Eldritch';
      case 'comedy': return '16-Bit Comedy';
      case 'fantasy': return 'High Guild Fantasy';
      default: return t;
    }
  };

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a retro 16-bit RPG narrator. Generate a funny and detailed quest outline for a developer based on this coding task: "${scenario}". Use the style of tone "${tone}" (${getToneName(tone)} style). 
Format your output exactly as a retro markdown scroll containing:
- A title
- A narrative background (1-2 sentences)
- A bulleted list of 3 actionable programming tasks representing the subquests
- A reward summary listing +20 Gold and +120 EXP.
Keep it compact and clean.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error('Gemini AI Forge Error:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize prompt scroll.' });
  }
});
