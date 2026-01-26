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
   const formRef = React.useRef<HTMLFormElement | null>(null);
   const [messages, setMessages] = React.useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = React.useState<boolean>(false);
   const { register, handleSubmit, reset, formState } = useForm<ChatInput>();

   React.useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   const onSubmit: SubmitHandler<ChatInput> = async ({ prompt }: ChatInput) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      try {
         reset();
         const { data } = await axios.post<ChatResponse>('/api/chat', {
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
         setIsBotTyping(false);
      }
   };
   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };
   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
                  key={index}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex gap-1 bg-gray-200 rounded-xl self-start px-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
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
