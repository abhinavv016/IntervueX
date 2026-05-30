import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Cpu,
  GitBranch,
  Globe2,
  Mic,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";
import Foot from "../component/foot";

// Types
interface SnippetLine {
  t: string;
  c: "muted" | "fn" | "code" | "ok";
}

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  span: string;
  kicker: string;
  icon: LucideIcon;
  title: string;
  body: string;
  meta: string;
  badge?: string;
}

//  TypingCode — animated terminal snippet
const SNIPPET: SnippetLine[] = [
  { t: "// two-sum.ts — live pair session", c: "muted" },
  { t: "function twoSum(nums: number[], target: number) {", c: "fn" },
  { t: "  const seen = new Map<number, number>();", c: "code" },
  { t: "  for (let i = 0; i < nums.length; i++) {", c: "code" },
  { t: "    const need = target - nums[i];", c: "code" },
  { t: "    if (seen.has(need)) return [seen.get(need)!, i];", c: "ok" },
  { t: "    seen.set(nums[i], i);", c: "code" },
  { t: "  }", c: "code" },
  { t: "}", c: "fn" },
  { t: "", c: "code" },
  { t: "// ✓ 14 / 14 test cases passed  ·  runtime 62ms", c: "ok" },
];

function TypingCode() {
  const full = useMemo(() => SNIPPET, []);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (lineIdx >= full.length) return;
    const current = full[lineIdx].t;

    if (charIdx < current.length) {

      const id = window.setTimeout(() => setCharIdx((v) => v + 1), 18);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      setLineIdx((v) => v + 1);
      setCharIdx(0);
    }, 220);

    return () => window.clearTimeout(id);
  }, [charIdx, lineIdx, full]);

  const colorOf = (c: SnippetLine["c"]) =>
  ({
    muted: "text-stone-500",
    fn: "text-cyan-400",
    code: "text-stone-200",
    ok: "text-emerald-300",
  }[c] || "text-stone-200");

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0d110d]/90 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(34,211,238,0.25)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-300/80" />
          <span className="size-2.5 rounded-full bg-cyan-400" />
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
          <Terminal className="size-3.5" />
          ~/intervuex/session/Abhinav + Kavya
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300/90">
          <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" /> LIVE
        </div>
      </div>

      <div className="grid grid-cols-[44px_1fr]">
        <div className="py-5 text-right pr-2 font-mono text-[12px] text-stone-600 select-none border-r border-white/5">
          {full.map((_, i) => (
            <div key={i} className="leading-7">{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>
        <pre className="py-5 px-4 font-mono text-[13.5px] leading-7 overflow-hidden">
          {full.map((line, i) => {
            const visible = i < lineIdx ? line.t : i === lineIdx ? line.t.slice(0, charIdx) : "";
            return (
              <div key={i} className={colorOf(line.c)}>
                {visible || "\u00A0"}
                {i === lineIdx && <span className="caret" />}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="size-7 rounded-full bg-linear-to-br from-rose-300 to-amber-200 border-2 border-[#0d110d] grid place-items-center text-[10px] font-bold text-black">AB</div>
            <div className="size-7 rounded-full bg-linear-to-br from-cyan-400 to-blue-300 border-2 border-[#0d110d] grid place-items-center text-[10px] font-bold text-black">KV</div>
          </div>
          <span className="text-[11px] font-mono text-stone-400">2 engineers · pair mode</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="size-7 grid place-items-center rounded-md bg-white/5 hover:bg-white/10 transition">
            <Mic className="size-3.5 text-stone-300" />
          </button>
          <button className="size-7 grid place-items-center rounded-md bg-white/5 hover:bg-white/10 transition">
            <Video className="size-3.5 text-stone-300" />
          </button>
        </div>
      </div>
    </div>
  );
}


//HomePage
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0d0a] text-stone-100 selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 size-130 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-40 size-105 rounded-full bg-blue-400/10 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0d0a]/70 border-b border-white/5">
        <div className="max-w-310 mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative size-9 rounded-lg bg-cyan-400 grid place-items-center shadow-[0_0_30px_-4px_rgba(34,211,238,0.6)] group-hover:rotate-3 transition-transform">
              <span className="font-mono font-black text-black text-lg">{"</>"}</span>
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-1">
                <span className="text-[19px] font-semibold tracking-tight">Intervue</span>
                <span className="text-[19px] font-serif-display italic text-cyan-400">X</span>
              </div>
              <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-stone-500">placement.engine</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how" className="hover:text-cyan-400 transition">How it works</a>
            <a href="#stats" className="hover:text-cyan-400 transition">Specs</a>
          </div>

          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="group inline-flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-cyan-400 text-black text-sm font-semibold hover:bg-white transition-colors">
                Get Started
                <span className="size-6 rounded-full bg-black grid place-items-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="size-3.5 text-cyan-400" />
                </span>
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 grid-bg opacity-50 mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <div className="relative max-w-310 mx-auto px-6 pt-20 pb-28">
          <div className="flex items-center gap-3 mb-10 reveal" style={{ animationDelay: "0.05s" }}>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">[01] / placement.season(2026)</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-10">
              <h1 className="text-[56px] sm:text-[72px] lg:text-[92px] leading-[0.92] tracking-[-0.04em] font-semibold reveal" style={{ animationDelay: "0.15s" }}>
                Get placement <br />
                <span className="font-serif-display italic text-cyan-400">ready</span>
                <span className="text-cyan-400">.</span>
                <span className="text-stone-500"> Together.</span>
              </h1>

              <p className="text-[17px] sm:text-[19px] text-stone-400 max-w-140 leading-relaxed reveal" style={{ animationDelay: "0.25s" }}>
                IntervueX is the collaborative arena where <span className="text-stone-100">future hires</span> sharpen real interview reflexes — pair programming, live video, instant feedback.
              </p>

              <div className="flex flex-wrap items-center gap-4 reveal" style={{ animationDelay: "0.35s" }}>
                <SignInButton mode="modal">
                  <button className="group relative inline-flex items-center gap-3 pl-6 pr-3 py-3 rounded-full bg-cyan-400 text-black font-semibold hover:bg-white transition-colors">
                    Start a session
                    <span className="size-9 rounded-full bg-black grid place-items-center group-hover:-rotate-12 transition-transform">
                      <ArrowUpRight className="size-4 text-cyan-400" />
                    </span>
                  </button>
                </SignInButton>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 reveal" style={{ animationDelay: "0.45s" }}>
                {[
                  { icon: Video, label: "HD video" },
                  { icon: Code2, label: "Live editor" },
                  { icon: Globe2, label: "12 languages" },
                  { icon: ShieldCheck, label: "Encrypted" },
                ].map((p) => (
                  <span key={p.label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/10 text-xs text-stone-300 font-mono">
                    <p.icon className="size-3.5 text-cyan-400" /> {p.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 lg:mt-6 reveal animate-float" style={{ animationDelay: "0.4s" }}>
              <TypingCode />
              <div className="mt-6 ml-auto w-fit flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/10 backdrop-blur">
                <div className="size-8 rounded-lg bg-cyan-400/15 grid place-items-center"><Sparkles className="size-4 text-cyan-400" /></div>
                <div className="text-xs">
                  <div className="text-stone-200 font-medium">Hint detected</div>
                  <div className="text-stone-500 font-mono text-[11px]">try a hashmap → O(n)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs Row */}
          <div id="stats" className="mt-28 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {[
              { v: "1080p", l: "crystal clear video", k: "01", s: "HD" },
              { v: "<40ms", l: "ultra-low latency", k: "02", s: "Ping" },
              { v: "Isolated", l: "noise-cancelled voice", k: "03", s: "Codec" },
              { v: "99.9%", l: "uptime reliability", k: "04", s: "SLA" },
            ].map((s) => (
              <div key={s.k} className="group">
                <div className="font-mono text-[11px] text-stone-500 mb-2">[ {s.k} // {s.s} ]</div>
                <div className="text-5xl lg:text-6xl tracking-tight font-semibold">
                  {s.v.match(/[0-9.]+/)?.[0]}
                  <span className="font-serif-display italic text-cyan-400">{s.v.replace(/[0-9.]+/, "")}</span>
                </div>
                <div className="mt-2 text-sm text-stone-400">{s.l}</div>
                <div className="mt-3 h-px bg-white/10 group-hover:bg-cyan-400/60 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="relative border-y border-white/5 bg-black/30 py-5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap text-stone-500 font-mono text-sm">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12 px-6">
              {["→ Google", "→ Stripe", "→ Razorpay", "→ Atlassian", "→ Microsoft", "→ Uber", "→ Amazon"].map((t) => (
                <span key={t + k} className="hover:text-cyan-400 transition-colors">{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative">
        <div className="max-w-310 mx-auto px-6 py-28">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-16">
            <div className="lg:col-span-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500 mb-5">[02] / what's inside</div>
              <h2 className="text-[44px] lg:text-[64px] leading-[0.95] tracking-[-0.03em] font-semibold">
                Everything you need to <span className="font-serif-display italic text-cyan-400">crack</span> the interview.
              </h2>
            </div>
            <div className="lg:col-span-5 text-stone-400 text-[16px] leading-relaxed lg:pl-8 lg:border-l lg:border-white/10">
              Three pillars. One uninterrupted flow. From the first <span className="font-mono text-stone-200">hello</span> to the final <span className="font-mono text-cyan-400">offer</span>.
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <FeatureCard span="lg:col-span-7" kicker="01 — face-to-face" icon={Video} title="Crystal HD video. Zero lag." body="Adaptive WebRTC keeps your interviewer locked in. Read the room, not the buffering wheel." meta="opus codec · 1080p · noise-cancelled" />
            <FeatureCard span="lg:col-span-5" kicker="02 — code in sync" icon={Code2} title="A real editor. Built for two." body="Operational-transform editor with syntax for 12+ languages. Live keystrokes." meta="js · py · java · cpp" />
            <FeatureCard span="lg:col-span-5" kicker="03 — toolset" icon={Users} title="Chat, Recording & Screen-share." body="Record your Session & Share-Screen. The whole interview toolkit, one keystroke away." meta="Record the Session" />
            <FeatureCard span="lg:col-span-7" kicker="04 — analysis" icon={Cpu} title="Live Session Oversight." body="Direct trainer-to-candidate control loop. Dynamically inject problems, monitor real-time progress, and maintain a structured technical workflow." meta="role-based workflow control" badge="NEW" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative bg-black/40 border-y border-white/5">
        <div className="max-w-310 mx-auto px-6 py-24">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500 mb-5">[03] / the loop</div>
          <h2 className="text-[40px] lg:text-[56px] leading-[0.95] tracking-[-0.03em] font-semibold mb-14 max-w-3xl">
            Three steps. <span className="font-serif-display italic text-cyan-400">Then</span> the offer letter.
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              { k: "step.01", t: "Schedule your Mock", d: "One click to the lobby. Unlimited mock sessions.", icon: GitBranch },
              { k: "step.02", t: "Run the interview", d: "Pick a problem set — DSA and go live.", icon: Terminal },
              {
                k: "step.03", t: "Review & Refine", d: "Turn every session into a clear roadmap for improvement.",
                icon: Zap,
              },
            ].map((s) => (
              <div key={s.k} className="bg-[#0a0d0a] p-8 hover:bg-[#0d110d] transition-colors group">
                <div className="flex items-center justify-between mb-10">
                  <span className="font-mono text-[11px] text-stone-500">{s.k}</span>
                  <s.icon className="size-5 text-stone-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-2xl font-semibold tracking-tight mb-3">{s.t}</div>
                <p className="text-stone-400 text-sm leading-relaxed">{s.d}</p>
                <div className="mt-8 inline-flex items-center gap-2 text-xs text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">↳ continue</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative">
        <div className="max-w-310 mx-auto px-6 py-28">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-linear-to-br from-[#0d110d] via-[#0a0d0a] to-black p-10 sm:p-16">
            <div className="absolute -top-32 -right-20 size-105 rounded-full bg-cyan-400/15 blur-[100px]" />
            <div className="relative grid md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-400 mb-6">$ ./start --campus you</div>
                <h3 className="text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.03em] font-semibold">
                  Your next interview <br /> is somebody's <span className="font-serif-display italic text-cyan-400">offer letter.</span>
                </h3>
              </div>
              <div className="md:col-span-4 flex md:justify-end">
                <SignInButton mode="modal">
                  <button className="group inline-flex items-center gap-3 pl-7 pr-3 py-4 rounded-full bg-cyan-400 text-black font-semibold text-lg hover:bg-white transition-colors">
                    Get placement ready
                    <span className="size-10 rounded-full bg-black grid place-items-center group-hover:-rotate-12 transition-transform"><ArrowUpRight className="size-5 text-cyan-400" /></span>
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <Foot />
    </div>
  );
}

function FeatureCard({ span, kicker, icon: Icon, title, body, meta, badge, ...rest }: FeatureCardProps) {
  return (
    <div {...rest} className={`relative ${span} group rounded-2xl border border-white/10 bg-white/2 hover:bg-white/4 hover:border-cyan-400/30 transition-all p-8 lg:p-10 overflow-hidden`}>
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/10 blur-3xl transition-all duration-700" />
      <div className="relative flex items-start justify-between mb-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">{kicker}</div>
        {badge && <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black text-[10px] font-bold font-mono">{badge}</span>}
      </div>
      <div className="relative flex items-start gap-5">
        <div className="size-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 grid place-items-center shrink-0 group-hover:bg-cyan-400/20 transition-colors"><Icon className="size-5 text-cyan-400" /></div>
        <div className="flex-1"><h3 className="text-[26px] lg:text-[30px] leading-tight tracking-tight font-semibold mb-3">{title}</h3><p className="text-stone-400 leading-relaxed">{body}</p></div>
      </div>
      <div className="relative mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="font-mono text-[11px] text-stone-500">{meta}</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-500 group-hover:text-cyan-400 transition-colors"><Check className="size-3.5" /> ready</span>
      </div>
    </div>
  );
}