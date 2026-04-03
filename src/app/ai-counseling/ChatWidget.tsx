"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi ${userName}! I'm Apple 9's AI counselor. I can help you with college applications, visa requirements, scholarships, and everything about studying abroad. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");

    const updatedMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setStreamedText("");

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." },
        ]);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter(Boolean);

        for (const line of lines) {
          if (line === "data: [DONE]") break;
          if (line.startsWith("data: ")) {
            try {
              const { text } = JSON.parse(line.slice(6));
              assistantMessage += text;
              setStreamedText(assistantMessage);
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
      setStreamedText("");
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-black/10 flex flex-col" style={{ height: "600px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-black/10">
        <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-syne font-extrabold text-sm text-[#0a0a0a]">Apple 9 AI Counselor</p>
          <p className="text-xs font-dm text-brand">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-brand-light" : "bg-[#0a0a0a]"}`}>
              {msg.role === "assistant"
                ? <Bot className="w-4 h-4 text-brand" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-dm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-brand-light/50 text-[#0a0a0a] rounded-tl-sm"
                  : "bg-brand text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {isStreaming && streamedText && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-brand" />
            </div>
            <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-brand-light/50 text-sm font-dm text-[#0a0a0a] leading-relaxed whitespace-pre-wrap">
              {streamedText}
              <span className="inline-block w-0.5 h-4 bg-brand ml-0.5 animate-pulse" />
            </div>
          </div>
        )}

        {isStreaming && !streamedText && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-brand" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-brand-light/50">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-black/10">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about colleges, visas, scholarships..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm font-dm text-[#0a0a0a] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            disabled={isStreaming}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs font-dm text-muted mt-1.5 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
