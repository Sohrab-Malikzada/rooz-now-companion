import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full gradient-warm animate-pulse-glow" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (password.length < 6) {
      toast.error("رمز عبور حداقل ۶ کاراکتر باید باشه");
      return;
    }

    setSubmitting(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, displayName || undefined);

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success("ثبت‌نام موفق! خوش اومدی 🎉");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="glass rounded-3xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl gradient-warm flex items-center justify-center glow">
              <span className="text-2xl">🌟</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">Rooz Now</h1>
            <p className="text-xs text-muted-foreground">
              {isLogin ? "خوش برگشتی رفیق!" : "بیا با هم شروع کنیم 🚀"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="نام نمایشی"
                dir="rtl"
                maxLength={50}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل"
              dir="ltr"
              required
              maxLength={255}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              dir="ltr"
              required
              minLength={6}
              maxLength={72}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full gradient-warm text-primary-foreground font-medium py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? "..." : isLogin ? "ورود" : "ثبت‌نام"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? "حساب نداری؟" : "حساب داری؟"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "ثبت‌نام کن" : "وارد شو"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
