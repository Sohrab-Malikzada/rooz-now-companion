import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, User, Settings, BarChart3, LogOut, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: MessageSquare, label: "چت" },
  { path: "/mood-history", icon: BarChart3, label: "تاریخچه حس" },
  { path: "/profile", icon: User, label: "پروفایل" },
  { path: "/settings", icon: Settings, label: "تنظیمات" },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: 260 }}
        animate={{ x: 0 }}
        exit={{ x: 260 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-50 w-64 glass border-l border-border p-6 flex flex-col"
        dir="rtl"
      >
        {/* User info */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
            <Sparkles size={18} className="text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.display_name || user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <button
          onClick={() => { signOut(); onClose(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} />
          <span>خروج</span>
        </button>
      </motion.aside>
    </>
  );
}
