import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';

type ChatInput = {
   prompt: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<ChatInput>();
   const onSubmit: SubmitHandler<ChatInput> = (data) => {
      console.log(data);
      reset();
   };
   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };
   return (
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
   );
};

export default ChatBot;
