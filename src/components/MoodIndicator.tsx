import { motion } from "framer-motion";
import { type Mood } from "@/lib/types";

const moodConfig: Record<Mood, { label: string; emoji: string; color: string }> = {
  happy: { label: "شاد", emoji: "😄", color: "bg-mood-happy/20 text-mood-happy" },
  stressed: { label: "تحت فشار", emoji: "😤", color: "bg-mood-stressed/20 text-mood-stressed" },
  calm: { label: "آرام", emoji: "☕", color: "bg-mood-calm/20 text-mood-calm" },
  motivated: { label: "باانگیزه", emoji: "💪", color: "bg-mood-motivated/20 text-mood-motivated" },
  lost: { label: "سردرگم", emoji: "🌙", color: "bg-mood-lost/20 text-mood-lost" },
};

interface MoodIndicatorProps {
  mood: Mood;
}

export function MoodIndicator({ mood }: MoodIndicatorProps) {
  const config = moodConfig[mood];

  return (
    <motion.div
      key={mood}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}
    >
      <span>{config.emoji}</span>
      <span dir="rtl">{config.label}</span>
    </motion.div>
  );
}
