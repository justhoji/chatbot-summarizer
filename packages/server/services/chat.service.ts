import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

interface ChatResponse {
   id: string;
   message: string;
}

const client = new OpenAI();
export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4.1-nano',
         input: prompt,
         max_output_tokens: 200,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLasResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
