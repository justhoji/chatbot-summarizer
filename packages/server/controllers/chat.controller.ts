import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'The prompt is too short')
      .max(1000, 'The prompt is too long (max 1000 characters)'),

   conversationId: z.uuid('Invalid UUID'),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
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
   },
};
