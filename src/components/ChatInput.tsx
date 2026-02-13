import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-2 flex items-center gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="چیزی بگو..."
        dir="rtl"
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center text-primary-foreground disabled:opacity-30 transition-opacity hover:opacity-90 active:scale-95"
      >
        <Send size={18} />
      </button>
    </motion.div>
  );
}
