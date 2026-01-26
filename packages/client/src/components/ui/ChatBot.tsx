import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './button';

type ChatInput = {
   prompt: string;
};
type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const conversationId = React.useRef(crypto.randomUUID());
   const lastMessageRef = React.useRef<HTMLDivElement | null>(null);
   const [messages, setMessages] = React.useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = React.useState<boolean>(false);
   const [error, setError] = React.useState<string>('');
   const { register, handleSubmit, reset, formState } = useForm<ChatInput>();

   React.useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   const onSubmit = async ({ prompt }: ChatInput) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         reset({ prompt: '' });
         const { data } = await axios.post<ChatResponse>('/api/chatx', {
            prompt,
            conversationId: conversationId.current,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         setIsBotTyping(false);
      } catch (error) {
         console.log(error);
         setError('Something went wrong!');
         setIsBotTyping(false);
      }
   };
   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };
   const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
            {messages.map((message, index) => (
               <div
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
                  key={index}
                  onCopy={onCopy}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isBotTyping && (
               <div className="flex gap-1 bg-gray-200 rounded-xl self-start px-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col items-end gap-3 border-2 rounded-2xl p-4"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 1,
               })}
               placeholder="Ask anything"
               className="w-full focus:outline-0 resize-none"
               maxLength={1000}
               name="prompt"
               id="prompt"
               autoFocus
            />
            <Button
               disabled={!formState.isValid}
               type="submit"
               className="w-10 h-10 rounded-full"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
