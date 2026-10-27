import { useEffect } from "react";
import { createPortal } from "react-dom";

const SECTIONS = [
  {
    h: "1. Information we collect",
    p: "When you play Masters Delight – Har Master Ke Liye, we collect the details you enter: your name, city and mobile number. We also record your game activity, such as quiz answers, scores and the time you played.",
  },
  {
    h: "2. How we use it",
    p: "We use your information to verify your mobile number with an OTP, run the game and leaderboard, announce winners, contact you about prizes or rewards you may have won, and improve the experience.",
  },
  {
    h: "3. Legal drinking age",
    p: "This game is only for adults of legal drinking age in their state. By continuing, you confirm that you meet this requirement. We do not knowingly collect information from anyone below the legal drinking age.",
  },
  {
    h: "4. Sharing your information",
    p: "We do not sell your personal information. It may be shared only with trusted service providers who help us run the game (such as hosting, SMS/OTP and database services), or when required by law.",
  },
  {
    h: "5. Storage and security",
    p: "Your information is stored on secure servers and kept only as long as needed for the purposes above or as required by law. We take reasonable steps to protect it, but no online system can be guaranteed to be 100% secure.",
  },
  {
    h: "6. Your choices",
    p: "You may ask to view, correct or delete your information, or withdraw your consent, by contacting us using the details below.",
  },
  {
    h: "7. Responsible drinking",
    p: "Please drink responsibly. Never drink and drive. This game is not intended to encourage consumption of alcohol.",
  },
  {
    h: "8. Changes to this policy",
    p: "We may update this policy from time to time. The latest version will always be available on this page.",
  },
  {
    h: "9. Contact us",
    p: "For any questions about this policy or your data, please contact the Masters Delight team at [your-email@example.com].",
  },
];

export default function PrivacyPolicy({ open, onClose, onAccept }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg animate-rise flex-col overflow-hidden rounded-2xl bg-[#d9141a] p-[3px] drop-shadow-[0_18px_40px_rgba(0,0,0,.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-0 flex-1 flex-col rounded-[0.9rem] bg-[radial-gradient(ellipse_at_30%_20%,#c0141a_0%,#a31017_55%,#8e0d13_100%)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f3d28a]/40 px-5 py-4">
            <h2
              id="privacy-title"
              className="bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] bg-clip-text font-head text-2xl font-semibold uppercase text-transparent"
            >
              Privacy Policy
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close privacy policy"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#f3d28a]/60 text-xl leading-none text-[#f3d28a] transition hover:bg-white/10"
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 font-body text-[14px] leading-relaxed text-white/95">
            <p className="text-xs text-white/70">Last updated: October 2026</p>
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h3 className="font-semibold text-[#f3d28a]">{s.h}</h3>
                <p className="mt-1">{s.p}</p>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-[#f3d28a]/40 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-md border-2 border-[#f3d28a]/70 font-head text-lg uppercase tracking-wider text-[#f3d28a] transition active:scale-95"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onAccept?.();
                onClose();
              }}
              className="h-11 flex-1 rounded-md border-2 border-[#f3d28a] bg-gradient-to-b from-[#fde9a6] via-[#f2bf4a] to-[#c98a1c] font-head text-lg font-semibold uppercase tracking-wider text-[#5a0a0e] shadow-[0_6px_16px_rgba(0,0,0,.45)] transition hover:brightness-110 active:scale-95"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
