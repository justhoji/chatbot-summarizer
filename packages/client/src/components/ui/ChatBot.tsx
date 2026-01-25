import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';

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
   const [messages, setMessages] = React.useState<Message[]>([]);

   const { register, handleSubmit, reset, formState } = useForm<ChatInput>();
   const onSubmit: SubmitHandler<ChatInput> = async ({ prompt }: ChatInput) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      try {
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         reset();
      } catch (error) {
         console.log(error);
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
                  {message.content}
               </p>
            ))}
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
