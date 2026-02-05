import React from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatInput = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatInput) => void;
};
const ChatForm = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatInput>();

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleFormSubmit();
      }
   };

   const handleFormSubmit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });
   return (
      <form
         onSubmit={handleFormSubmit}
         onKeyDown={handleKeyDown}
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
   );
};

export default ChatForm;
