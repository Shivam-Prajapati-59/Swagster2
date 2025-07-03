"use client";
import ChatForm from "@/components/custom/ChatForm";
import ChatMessage from "@/components/custom/ChatMessage";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  const handleSentMessage = (message: string) => {
    console.log(message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold">Room: 1</h1>

      <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 rounded-lg shadow-md w-full max-w-2xl">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            sender={msg.sender}
            message={msg.message}
            isOwnMessage={msg.sender === username}
          />
        ))}
      </div>

      <div>
        {/* TODO ADD Chat Room */}

        <ChatForm onSendMessage={handleSentMessage} />
      </div>
    </div>
  );
}
