import React from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};

type Props = {
   messages: Message[];
};
const ChatMessages = ({ messages }: Props) => {
   React.useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   const lastMessageRef = React.useRef<HTMLDivElement | null>(null);

   return (
      <div className="flex flex-col gap-3">
         {messages.map((message, index) => (
            <div
               className={`px-3 py-1 max-w-md rounded-xl ${
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
      </div>
   );
};

export default ChatMessages;
