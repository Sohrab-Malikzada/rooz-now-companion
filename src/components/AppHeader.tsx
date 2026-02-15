import { motion } from "framer-motion";
import { Menu } from "lucide-react";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl px-5 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center glow">
          <span className="text-lg">🌟</span>
        </div>
        <div>
          <h1 className="text-base font-bold gradient-text">Rooz Now</h1>
          <p className="text-[10px] text-muted-foreground tracking-wider">BREAK THE LOOP</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-mood-motivated animate-pulse-glow" />
          <span className="text-xs text-muted-foreground">آنلاین</span>
        </div>
        {onMenuClick && (
          <button onClick={onMenuClick} className="text-muted-foreground hover:text-foreground transition-colors">
            <Menu size={20} />
          </button>
        )}
      </div>
    </motion.header>
  );
}
