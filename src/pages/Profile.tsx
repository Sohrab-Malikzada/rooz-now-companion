import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setProfession(data.profession || "");
          setBio(data.bio || "");
          setInterests((data.interests || []).join("، "));
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim().slice(0, 100),
        profession: profession.trim().slice(0, 100),
        bio: bio.trim().slice(0, 500),
        interests: interests
          .split(/[،,]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 20),
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) toast.error("خطا در ذخیره");
    else toast.success("پروفایل ذخیره شد ✅");
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
          <h1 className="text-lg font-bold gradient-text" dir="rtl">پروفایل</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 space-y-4"
          dir="rtl"
        >
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">نام نمایشی</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">حرفه / شغل</label>
            <input
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              maxLength={100}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">علاقه‌مندی‌ها (با ویرگول جدا کن)</label>
            <input
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              maxLength={500}
              placeholder="موسیقی، برنامه‌نویسی، کوه‌نوردی"
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">درباره من</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full gradient-warm text-primary-foreground font-medium py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {saving ? "در حال ذخیره..." : "ذخیره پروفایل"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
