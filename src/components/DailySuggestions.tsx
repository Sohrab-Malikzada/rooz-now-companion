import { motion } from "framer-motion";
import { DAILY_SUGGESTIONS } from "@/lib/constants";

export function DailySuggestions() {
  return (
    <div className="space-y-3" dir="rtl">
      <h3 className="text-xs font-medium text-muted-foreground px-1">
        پیشنهادات امروز ✨
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {DAILY_SUGGESTIONS.map((item, i) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass-light rounded-xl p-3 cursor-pointer hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-medium text-foreground">{item.title}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
