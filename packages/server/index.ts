import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
dotenv.config();

const client = new OpenAI();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('HEllo world!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello World',
   });
});

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'The prompt is too short')
      .max(1000, 'The prompt is too long (max 1000 characters)'),

   conversationId: z.uuid('Invalid UUID'),
});

const conversations = new Map<string, string>();
app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, conversationId } = req.body;
   const { success, data, error } = chatSchema.safeParse(req.body);
   if (!success) {
      res.status(400).json({
         error: error,
      });
      return;
   }
   const response = await client.responses.create({
      model: 'gpt-5-nano',
      input: prompt,
      max_output_tokens: 800,
      previous_response_id: conversations.get(conversationId),
   });
   conversations.set(conversationId, response.id);
   res.json({ message: response.output_text });
});
app.listen(port, () => {
   console.log(`Server listening on port ${port}...`);
});
