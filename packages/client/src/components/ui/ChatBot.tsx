import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';

const ChatBot = () => {
   return (
      <div className="flex flex-col items-end gap-3 border-2 rounded-2xl p-4">
         <textarea
            placeholder="Ask anything"
            className="w-full focus:outline-0 resize-none"
            maxLength={1000}
            name="chat"
            id="chat"
         />
         <Button className="w-10 h-10 rounded-full">
            <FaArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;
