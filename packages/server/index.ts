import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';
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

app.post('/api/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, conversationId } = req.body;
      const { success, error } = chatSchema.safeParse(req.body);
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
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLasResponseId(conversationId, response.id);
      res.json({ message: response.output_text });
   } catch (error) {
      res.status(500).json({
         error: 'Failed to generate response.',
      });
   }
});
app.listen(port, () => {
   console.log(`Server listening on port ${port}...`);
});
