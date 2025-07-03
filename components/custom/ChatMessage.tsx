import React from "react";

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage?: boolean;
}

const ChatMessage = ({ sender, message, isOwnMessage }: ChatMessageProps) => {
  const isSystemMessage = sender === "System";

  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "jsutify-start"
      } items-center w-full mt-3
      }  `}
    >
      <div
        className={`max-w-s px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        } shadow-md`}
      >
        {isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
