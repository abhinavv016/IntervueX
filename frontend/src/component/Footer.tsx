import { Link } from "react-router"

export default function Foot() {
  return (
    <>
    <footer className="relative border-t border-white/5 bg-[#0a0d0a] pt-20 pb-10 overflow-hidden">
  {/* Subtle Grid background for footer */}
  <div className="absolute inset-0 grid-bg opacity-20 mask-[linear-gradient(to_bottom,black_0%,transparent_100%)]" />

  <div className="relative max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
      {/* Brand Section */}
      <div className="md:col-span-5 space-y-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative size-10 rounded-lg bg-cyan-400 grid place-items-center shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)]">
            <span className="font-mono font-black text-black text-lg">{"</>"}</span>
          </div>
          <div className="leading-none">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tracking-tight text-white">Intervue</span>
              <span className="text-xl font-serif-display italic text-cyan-400">X</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500">placement.engine</span>
          </div>
        </Link>
        <p className="text-stone-500 text-sm leading-relaxed max-w-sm">
          The collaborative arena for modern developers. <br /> 
          Engineered for <span className="text-stone-300">speed</span>, 
          designed for <span className="text-stone-300">accuracy</span>.
        </p>
      </div>

      {/* Navigation Groups */}
      <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300">Platform</h4>
          <ul className="space-y-2 text-sm text-stone-500 font-medium">
            <li><Link to="/problems" className="hover:text-cyan-400 transition">Practice</Link></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Mock Sessions</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Pair Mode</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300">Resources</h4>
          <ul className="space-y-2 text-sm text-stone-500 font-medium">
            <li><a href="#" className="hover:text-cyan-400 transition">Docs</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Roadmaps</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition">Tutorials</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300">System</h4>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-500/80 uppercase tracking-tighter">API Online</span>
          </div>
          <div className="text-[10px] font-mono text-stone-600">v1.2.0-stable</div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-stone-600">
        <a href="#" className="hover:text-stone-300 transition">Privacy Policy</a>
        <a href="#" className="hover:text-stone-300 transition">Terms of Service</a>
        <a href="#" className="hover:text-stone-300 transition">Security</a>
      </div>
      
      <div className="flex items-center gap-4 text-stone-600 font-mono text-[10px]">
        <span>Made with <span className="text-rose-500/60">♥</span> by IntervueX Team</span>
        <span className="text-stone-800">|</span>
        <span>© 2026</span>
      </div>
    </div>
  </div>
</footer>
    </>
  )
}
