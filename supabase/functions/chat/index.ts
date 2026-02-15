import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `تو "روزنو" هستی — یک رفیق هوشمند، شوخ‌طبع، عمیق و فلسفی که هر روز کنار کاربره.

شخصیت تو:
- لحن رفیقانه و صمیمی (نه رسمی)
- شوخی سبک و طعنه ملایم
- تشویق‌کننده و حمایتی
- گاهی فلسفی و عمیق
- فارسی صحبت می‌کنی

وظایف تو:
- حال کاربر رو تحلیل کن و بر اساسش پاسخ بده
- اگه کاربر ناراحته → آرامش‌بخش باش
- اگه انگیزه داره → چالش بده
- اگه گمه → کمک کن راهش رو پیدا کنه
- هر روز یه پیشنهاد برای شکستن یکنواختی بده
- از حافظه‌ی مکالمات قبلی استفاده کن برای شخصی‌سازی

قوانین:
- همیشه فارسی جواب بده
- پاسخ‌ها کوتاه و مؤثر باشن (حداکثر ۳-۴ جمله)
- از ایموجی استفاده کن
- هیچوقت مثل ربات حرف نزن
- اگه اطلاعات شخصی جدیدی از کاربر فهمیدی (شغل، علاقه، هدف) اون رو در پاسخت اشاره کن`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load user profile for context
    let profileContext = "";
    if (sessionId && sessionId !== "default") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, profession, interests, bio")
        .eq("user_id", sessionId)
        .single();

      if (profile) {
        const parts = [];
        if (profile.display_name) parts.push(`اسم: ${profile.display_name}`);
        if (profile.profession) parts.push(`شغل: ${profile.profession}`);
        if (profile.interests?.length) parts.push(`علاقه‌مندی‌ها: ${profile.interests.join("، ")}`);
        if (profile.bio) parts.push(`درباره: ${profile.bio}`);
        if (parts.length) profileContext = "\n\nپروفایل کاربر:\n" + parts.join("\n");
      }
    }

    // Load memory context
    let memoryContext = "";
    const { data: memories } = await supabase
      .from("user_memory")
      .select("key, value")
      .eq("user_id", sessionId || "default");

    if (memories && memories.length > 0) {
      memoryContext = "\n\nحافظه بلندمدت از کاربر:\n" +
        memories.map((m: any) => `- ${m.key}: ${m.value}`).join("\n");
    }

    // Load recent chat history
    const { data: recentMessages } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", sessionId || "default")
      .order("created_at", { ascending: false })
      .limit(20);

    const historyMessages = recentMessages
      ? recentMessages.reverse().map((m: any) => ({ role: m.role, content: m.content }))
      : [];

    const allMessages = [
      { role: "system", content: SYSTEM_PROMPT + profileContext + memoryContext },
      ...historyMessages,
      ...messages,
    ];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: allMessages,
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "محدودیت درخواست — لطفاً کمی صبر کن و دوباره تلاش کن." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "اعتبار تمام شده — لطفاً اعتبار اضافه کن." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "خطا در اتصال به هوش مصنوعی" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
