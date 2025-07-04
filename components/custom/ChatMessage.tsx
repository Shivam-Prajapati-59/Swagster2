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
          : "justify-start"
      } w-full mb-3`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-600 text-white text-center text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black border border-gray-200"
        } shadow-md`}
      >
        {!isSystemMessage && (
          <p className="text-xs text-gray-500 mb-1 font-medium">{sender}</p>
        )}
        {isSystemMessage && <p className="text-sm font-bold mb-1">{sender}</p>}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
