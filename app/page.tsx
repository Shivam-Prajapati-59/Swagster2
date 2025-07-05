"use client";
import ChatForm from "@/components/custom/ChatForm";
import ChatMessage from "@/components/custom/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data]);
    });

    // Listen for user join/leave notifications
    socket.on("user_Joined", (message) => {
      console.log("User joined:", message);
      setMessages((prev) => [...prev, { sender: "System", message: message }]);
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off("message");
      socket.off("user_Joined");
      console.log("Socket listeners cleaned up");
    };
  }, []); // Fixed: Added empty dependency array

  // Handle sending a message
  const handleSentMessage = (message: string) => {
    const data = {
      roomId,
      message,
      sender: username,
    };

    // Add message to local state immediately for better UX
    setMessages((prev) => [...prev, { sender: username, message }]);

    // Send message to server
    socket.emit("message", data);
  };

  // Handle joining a room
  const handleJoinRoom = () => {
    if (roomId && username) {
      // Emit joinRoom event with proper data structure
      socket.emit("joinRoom", { roomId, username });
      setJoined(true);
      console.log(`${username} attempting to join room ${roomId}`);
    }
  };

  // Handle leaving a room
  const handleLeaveRoom = () => {
    setJoined(false);
    setMessages([]); // Clear messages when leaving
    // Optionally disconnect and reconnect to clean up server state
    socket.disconnect();
    socket.connect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!joined ? (
        // Login/Join Room Screen
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                disabled={!roomId || !username}
                className="w-full p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Chat Room Screen
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Room: {roomId} {/* Fixed: Show actual room ID */}
                </h1>
                <p className="text-sm text-gray-600">Welcome, {username}!</p>
              </div>
              <button
                onClick={handleLeaveRoom}
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
