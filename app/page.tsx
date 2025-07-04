"use client";
import ChatForm from "@/components/custom/ChatForm";
import ChatMessage from "@/components/custom/ChatMessage";
import { socket } from "@/lib/socketClient"; //
import { useEffect, useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    socket.on("user_Joined", (message) => {
      console.log(message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "System",
          message: message,
        },
      ]);
    });

    return () => {
      socket.off("user_Joined"); // Clean up the event listener
      socket.off("message"); // Clean up the message event listener
    };
  }, []);

  const handleSentMessage = (message: string) => {
    const newMessage = {
      sender: username,
      message: message,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleJoinRoom = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }
    setJoined(true);
    // Add a welcome message
    setMessages([
      {
        sender: "System",
        message: `${username} joined the room`,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!joined ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome!
              </h1>
              <p className="text-gray-600">Join a chat room to get started</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Room: 1</h1>
                <p className="text-sm text-gray-600">Welcome, {username}!</p>
              </div>
              <button
                onClick={() => setJoined(false)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
            {/* Messages Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <p className="text-lg font-medium">No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      sender={msg.sender}
                      message={msg.message}
                      isOwnMessage={msg.sender === username}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Chat Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ChatForm onSendMessage={handleSentMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
