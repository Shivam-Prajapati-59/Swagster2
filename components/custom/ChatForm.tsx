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
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-md w-full"
    >
      <input
        type="text"
        onChange={(e: any) => setMessage(e.target.value)}
        className="flex-1 px-4 border-2 py-2 rounded-lg focus:outline-none focus:border-blue-500"
        placeholder="Type your message here..."
        value={message}
      />

      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
};

export default ChatForm;
