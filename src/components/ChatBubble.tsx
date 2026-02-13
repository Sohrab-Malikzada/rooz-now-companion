import { motion } from "framer-motion";
import { type Message, type Mood } from "@/lib/types";

const moodColors: Record<Mood, string> = {
  happy: "border-mood-happy/30",
  stressed: "border-mood-stressed/30",
  calm: "border-mood-calm/30",
  motivated: "border-mood-motivated/30",
  lost: "border-mood-lost/30",
};

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  const moodBorder = message.mood ? moodColors[message.mood] : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full gradient-warm flex-shrink-0 flex items-center justify-center mr-3 mt-1">
          <span className="text-sm">🌟</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "glass border border-primary/20 text-foreground rounded-br-md"
            : `glass-light ${moodBorder} border rounded-bl-md text-foreground`
        }`}
        dir="rtl"
      >
        {message.content}
      </div>
    </motion.div>
  );
}
