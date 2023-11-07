"use client";
import socket from "@/service/socket";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isUsernameFree, setIsUsernameFree] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.once("old-messages", (data) => {
      setMessages((msg) => [...msg, ...data]);
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    console.log({ text });
    handleUsernameFree(text);
  }, [text]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      content,
      username: "me",
      timeSent: new Date().toUTCString(),
    });

    setContent("");
  };

  const setUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("username-set", {
      username: text,
    });
  };

  const handleUsernameFree = (username) => {
    socket.emit(
      "username-free",
      {
        username,
      },
      (data: boolean) => {
        console.log({ data });
        setIsUsernameFree(data);
      }
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="card w-full">
        <form onSubmit={setUsername} className="flex gap-4 m-8">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`input input-bordered w-full max-w-xs ${
              isUsernameFree ? "input-success" : "input-error"
            }`}
          />
          <button type="submit" className="btn">
            Send
          </button>
        </form>
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
