import * as React from 'react';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import type { ChatInput } from './ChatInput';
import ChatForm from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const conversationId = React.useRef(crypto.randomUUID());
   const [messages, setMessages] = React.useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = React.useState<boolean>(false);
   const [error, setError] = React.useState<string>('');

   const onSubmit = async ({ prompt }: ChatInput) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
         setIsBotTyping(false);
      } catch (error) {
         console.log(error);
         setError('Something went wrong!');
         setIsBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <ChatForm onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
