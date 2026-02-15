import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const MOOD_EMOJI: Record<string, string> = {
  happy: "😄",
  stressed: "😤",
  calm: "☕",
  motivated: "💪",
  lost: "🌙",
};

const MOOD_LABELS: Record<string, string> = {
  happy: "شاد",
  stressed: "تحت فشار",
  calm: "آرام",
  motivated: "باانگیزه",
  lost: "سردرگم",
};

const MoodHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("sentiment_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setLogs(data);
      });
  }, [user]);

  // Group by date
  const grouped = logs.reduce<Record<string, typeof logs>>((acc, log) => {
    const date = new Date(log.created_at).toLocaleDateString("fa-IR");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-lg font-bold gradient-text" dir="rtl">تاریخچه حس‌وحال</h1>
        </motion.div>

        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-8 text-center"
            dir="rtl"
          >
            <p className="text-muted-foreground text-sm">هنوز داده‌ای ثبت نشده. شروع به چت کن تا mood تو ثبت بشه 🌟</p>
          </motion.div>
        ) : (
          <div className="space-y-4" dir="rtl">
            {Object.entries(grouped).map(([date, items]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 space-y-3"
              >
                <h3 className="text-xs font-medium text-muted-foreground">{date}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item: any) => (
                    <div
                      key={item.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 text-xs"
                    >
                      <span>{MOOD_EMOJI[item.mood] || "🔵"}</span>
                      <span>{MOOD_LABELS[item.mood] || item.mood}</span>
                      <span className="text-muted-foreground">
                        ({new Date(item.created_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })})
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory;
