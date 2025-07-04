"use client";
import React, { useState } from "react";

const ChatForm = ({
  onSendMessage,
}: {
  onSendMessage?: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() !== "") {
      onSendMessage && onSendMessage(message);
      setMessage("");
    }
    console.log("Submmitted");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
      <input
        type="text"
        onChange={(e: any) => setMessage(e.target.value)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        placeholder="Type your message here..."
        value={message}
      />

      <button
        type="submit"
        disabled={message.trim() === ""}
        className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:transform-none"
      >
        Send
      </button>
    </form>
  );
};

export default ChatForm;
