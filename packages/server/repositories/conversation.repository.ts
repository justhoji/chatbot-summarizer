const conversations = new Map<string, string>();

export const conversationRepository = {
   getLastResponseId(conversationId: string) {
      return conversations.get(conversationId);
   },

   setLasResponseId(conversationId: string, responseId: string) {
      conversations.set(conversationId, responseId);
   },
};
