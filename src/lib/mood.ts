import { type Mood } from "./types";
import { MOOD_RESPONSES } from "./constants";

const MOOD_KEYWORDS: Record<Mood, string[]> = {
  happy: ["خوشحال", "عالی", "خوب", "شاد", "ممنون", "حالم خوبه", "عالیه", "خیلی خوبم", "هیجان", "😄", "😊", "🎉"],
  stressed: ["استرس", "فشار", "عصبی", "خسته", "کلافه", "نمی‌تونم", "سخته", "داغون", "😤", "😩"],
  calm: ["آروم", "خوب", "نرمال", "بد نیست", "معمولی", "☕"],
  motivated: ["انگیزه", "آماده", "قوی", "می‌خوام", "بزن بریم", "شروع", "💪", "🔥"],
  lost: ["گم", "نمی‌دونم", "سردرگم", "بی‌هدف", "خالی", "پوچ", "معنی", "چرا", "🌙"],
};

export function detectMood(text: string): Mood {
  const lower = text.toLowerCase();
  let bestMood: Mood = "calm";
  let bestScore = 0;

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    const score = keywords.filter((k) => lower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood as Mood;
    }
  }

  return bestMood;
}

export function getMoodResponse(mood: Mood): string {
  const responses = MOOD_RESPONSES[mood];
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "شب بخیر 🌙 هنوز بیداری؟";
  if (hour < 12) return "صبح بخیر ☀️ امروز چه خبر؟";
  if (hour < 17) return "ظهر بخیر 🌤 نیمه‌ی روز رسید!";
  if (hour < 21) return "عصر بخیر 🌅 روز چطور بود؟";
  return "شب بخیر 🌙 وقت بازتاب امروزه...";
}
