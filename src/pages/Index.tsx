import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { AppHeader } from "@/components/AppHeader";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { MoodIndicator } from "@/components/MoodIndicator";
import { DailySuggestions } from "@/components/DailySuggestions";
import { type Message, type Mood } from "@/lib/types";
import { INITIAL_MESSAGES } from "@/lib/constants";
import { detectMood, getMoodResponse, getTimeGreeting } from "@/lib/mood";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [currentMood, setCurrentMood] = useState<Mood>("calm");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const mood = detectMood(text);
    setCurrentMood(mood);
    setShowSuggestions(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      mood,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = getMoodResponse(mood);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        mood,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-lg mx-auto w-full p-4 gap-4">
        <AppHeader />

        {/* Mood indicator */}
        <div className="flex justify-center">
          <MoodIndicator mood={currentMood} />
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden space-y-1 py-2">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-2"
            >
              <div className="w-8 h-8 rounded-full gradient-warm flex-shrink-0 flex items-center justify-center">
                <span className="text-sm">🌟</span>
              </div>
              <div className="glass-light rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Daily suggestions */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <DailySuggestions />
          </motion.div>
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
};

export default Index;
