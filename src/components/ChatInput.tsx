"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({ onSend, placeholder = "메시지를 입력해줘...", disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-card-bg border border-card-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted/60"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-accent text-white disabled:opacity-30 transition-opacity active:scale-95"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
