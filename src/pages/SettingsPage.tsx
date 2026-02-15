import { motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClearHistory = async () => {
    if (!user) return;
    const confirmed = window.confirm("مطمئنی می‌خوای تاریخچه چت رو پاک کنی؟");
    if (!confirmed) return;

    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", user.id);

    if (error) toast.error("خطا در پاک‌سازی");
    else toast.success("تاریخچه چت پاک شد");
  };

  const handleClearMemory = async () => {
    if (!user) return;
    const confirmed = window.confirm("حافظه بلندمدت AI پاک بشه؟ این کار قابل بازگشت نیست.");
    if (!confirmed) return;

    const { error } = await supabase
      .from("user_memory")
      .delete()
      .eq("user_id", user.id);

    if (error) toast.error("خطا");
    else toast.success("حافظه پاک شد");
  };

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
          <h1 className="text-lg font-bold gradient-text" dir="rtl">تنظیمات</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
          dir="rtl"
        >
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-medium text-foreground">مدیریت داده‌ها</h3>
            <button
              onClick={handleClearHistory}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors"
            >
              <Trash2 size={16} />
              <span>پاک‌سازی تاریخچه چت</span>
            </button>
            <button
              onClick={handleClearMemory}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors"
            >
              <Trash2 size={16} />
              <span>پاک‌سازی حافظه بلندمدت AI</span>
            </button>
          </div>

          <div className="glass rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-medium text-foreground">اطلاعات حساب</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
