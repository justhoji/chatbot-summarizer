import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';
import { chatService } from './services/chat.service';
dotenv.config();

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
      const response = await chatService.sendMessage(prompt, conversationId);
      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({
         error: 'Failed to generate response.',
      });
   }
});
app.listen(port, () => {
   console.log(`Server listening on port ${port}...`);
});
