export type Mood = "happy" | "stressed" | "calm" | "motivated" | "lost";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mood?: Mood;
}

export interface DailySuggestion {
  type: "micro-challenge" | "creative" | "mindset" | "growth";
  icon: string;
  title: string;
  text: string;
}
