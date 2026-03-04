"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "@/components/AppHeader";
import { API_URL } from "@/lib/api";

export default function AskPage() {
  const { token, isLoading } = useAuth();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !token) {
      window.location.hash = "#/";
    }
  }, [token, isLoading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !token) return;
    const question = input.trim();
    setInput("");
    const updatedMessages = [...messages, { role: "user" as const, content: question }];
    setMessages(updatedMessages);
    setIsLoadingMsg(true);
    setError("");

    const history = updatedMessages.slice(0, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch(`${API_URL}/api/v1/recipes/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Request failed");
      }
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoadingMsg(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="flex h-[100dvh] flex-col bg-amber-50">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-3 py-3 sm:px-4 sm:py-6">
        <h1 className="mb-1 text-xl font-bold text-stone-900 sm:mb-2 sm:text-2xl">Ask AI</h1>
        <p className="mb-3 text-sm text-gray-800 sm:mb-6 sm:text-base">
          Ask questions about recipes from our database.
        </p>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-amber-200/80 bg-white p-3 shadow-sm sm:gap-4 sm:p-6">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-700 sm:text-base">
              Ask a question to get started. Try &quot;Tell me about carbonara&quot; or &quot;How do I make pasta?&quot;
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[90%] break-words rounded-lg px-3 py-2 text-sm sm:max-w-[85%] sm:px-4 sm:text-base ${
                m.role === "user"
                  ? "ml-auto bg-amber-100 text-amber-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          {isLoadingMsg && (
            <div className="max-w-[90%] rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-500 sm:max-w-[85%] sm:px-4 sm:text-base">
              Thinking...
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 sm:px-4 sm:text-base">{error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mt-3 flex gap-2 sm:mt-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about recipes..."
            disabled={isLoadingMsg}
            className="min-w-0 flex-1 rounded-lg border border-amber-200/80 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:px-4 sm:py-3 sm:text-base"
          />
          <button
            type="submit"
            disabled={isLoadingMsg || !input.trim()}
            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-50 sm:px-6 sm:py-3 sm:text-base"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
