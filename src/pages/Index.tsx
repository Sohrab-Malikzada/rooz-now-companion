import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import { AppHeader } from "@/components/AppHeader";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { MoodIndicator } from "@/components/MoodIndicator";
import { DailySuggestions } from "@/components/DailySuggestions";
import { type Message, type Mood } from "@/lib/types";
import { detectMood, getTimeGreeting } from "@/lib/mood";
import { streamChat } from "@/lib/chat-stream";
import { supabase } from "@/integrations/supabase/client";

const SESSION_ID = "default";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMood, setCurrentMood] = useState<Mood>("calm");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load existing messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", SESSION_ID)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at),
            mood: m.mood as Mood | undefined,
          }))
        );
        setShowSuggestions(false);
      } else {
        // First visit - send greeting
        const greeting = getTimeGreeting();
        const greetingMsg: Message = {
          id: "greeting",
          role: "assistant",
          content: `سلام رفیق! 👋 من روزنو هستم، همراه هر روزت. ${greeting}`,
          timestamp: new Date(),
          mood: "calm",
        };
        setMessages([greetingMsg]);
        // Save greeting to DB
        await supabase.from("chat_messages").insert({
          session_id: SESSION_ID,
          role: "assistant",
          content: greetingMsg.content,
          mood: "calm",
        });
      }
      setInitialized(true);
    };
    loadMessages();
  }, []);

  const handleSend = async (text: string) => {
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

    // Save user message to DB
    await supabase.from("chat_messages").insert({
      session_id: SESSION_ID,
      role: "user",
      content: text,
      mood,
    });

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    try {
      await streamChat({
        messages: [{ role: "user", content: text }],
        sessionId: SESSION_ID,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.id === assistantId) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [
              ...prev,
              {
                id: assistantId,
                role: "assistant" as const,
                content: assistantContent,
                timestamp: new Date(),
                mood,
              },
            ];
          });
        },
        onDone: async () => {
          setIsTyping(false);
          // Save assistant message to DB
          if (assistantContent) {
            await supabase.from("chat_messages").insert({
              session_id: SESSION_ID,
              role: "assistant",
              content: assistantContent,
              mood,
            });
          }
        },
        onError: (error) => {
          setIsTyping(false);
          toast.error(error);
        },
      });
    } catch (e) {
      setIsTyping(false);
      toast.error("خطا در اتصال به هوش مصنوعی");
    }
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

          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
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
        {showSuggestions && initialized && (
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
