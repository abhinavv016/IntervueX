import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { 
  ChevronRight, 
  Terminal, 
  Zap, 
  Brain, 
  Flame, 
  Search,
  LayoutGrid,
  X
} from "lucide-react";

import { PROBLEMS } from "../data/problems";
import Navbar from "../component/navbar";
import type { Problem } from "../component/ProblemDescription";
import { Footer } from "../component/Footer";

const ProblemsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: problems = [] } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      return Object.values(PROBLEMS) as Problem[];
    },
  });

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="relative min-h-screen bg-[#0a0d0a] text-stone-100 selection:bg-cyan-400 selection:text-black overflow-x-hidden grain">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] -left-32 size-130 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="absolute inset-0 grid-bg opacity-30 mask-[radial-gradient(ellipse_at_top,black_40%,transparent_80%)] -z-10" />

        <header className="relative mb-16 reveal" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
              [02] / solve.module / practice.mode
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-[56px] lg:text-[72px] leading-[0.92] tracking-[-0.04em] font-semibold">
                Practice. <br />
                <span className="font-serif-display italic text-cyan-400">problems</span>
              </h1>
            </div>

            {/* THE WORKABLE SEARCH */}
            <div className="relative group min-w-[320px]">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 transition-colors ${searchQuery ? 'text-cyan-400' : 'text-stone-500'}`} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a problem or category..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-10 text-sm font-mono focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-all placeholder:text-stone-600"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X size={14} className="text-stone-400" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 reveal" style={{ animationDelay: "0.2s" }}>
          {[
            { label: "Library", val: problems.length, icon: LayoutGrid, color: "text-cyan-400" },
            { label: "Easy", val: easyCount, icon: Zap, color: "text-emerald-400" },
            { label: "Medium", val: mediumCount, icon: Brain, color: "text-amber-300" },
            { label: "Hard", val: hardCount, icon: Flame, color: "text-rose-400" },
          ].map((s, i) => (
            <div key={i} className="bg-white/4 border border-white/10 rounded-2xl p-5 group transition-all hover:bg-white/6">
              <div className="flex items-center justify-between mb-2">
                 <s.icon className={`size-4 ${s.color} opacity-60`} />
                 <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">{s.label}</span>
              </div>
              <p className="text-3xl font-semibold tracking-tight">{s.val}</p>
            </div>
          ))}
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4 reveal" style={{ animationDelay: "0.3s" }}>
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, idx) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="group relative block bg-white/2 border border-white/5 hover:border-cyan-400/30 rounded-2xl transition-all duration-300"
              >
                <div className="relative px-8 py-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="mt-1.5 font-mono text-[11px] text-stone-600 group-hover:text-cyan-400/60 transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-[22px] font-semibold tracking-tight group-hover:text-white transition-colors">
                          {problem.title}
                        </h2>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
                         <span className="flex items-center gap-1.5"><Terminal size={12} className="text-cyan-400" /> {problem.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="size-11 rounded-full bg-white/5 border border-white/10 grid place-items-center group-hover:bg-cyan-400 transition-all duration-300">
                    <ChevronRight className="size-5 text-stone-400 group-hover:text-black" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <p className="font-mono text-stone-500 text-sm">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs font-bold text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </div>
  );
};

function getDifficultyColor(diff: string) {
  switch (diff) {
    case "Easy": return "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
    case "Medium": return "text-amber-300 border-amber-300/20 bg-amber-300/5";
    case "Hard": return "text-rose-400 border-rose-400/20 bg-rose-400/5";
    default: return "text-stone-400 border-stone-400/20 bg-stone-400/5";
  }
}

export default ProblemsPage;