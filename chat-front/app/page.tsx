"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      content,
      username: "me",
      timeSent: new Date().toUTCString(),
    });

    setContent("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="card w-full">
        {messages.map((m) => (
          <div className="chat chat-start" key={m.timeSent}>
            <div className="chat-header">{m.username}</div>
            <div className="chat-bubble">{m.content}</div>
            <div className="chat-footer opacity-50">
              <time className="text-xs opacity-50">{m.timeSent}</time>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-4 ">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </main>
  );
}
