import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions
} from "../hooks/useSessions";

// Components


import Navbar from "../component/navbar";
import ActiveSessions from "../component/ActiveSessions";
import CreateSessionModal from "../component/CreateSessionModal";
import RecentSessions from "../component/RecentSessions";
import StatsCards from "../component/StatsCards";
import WelcomeSection from "../component/WelcomeSection";
import Footer from "../component/Footer";


function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toUpperCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session.id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session: any) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <div className="relative min-h-screen bg-[#0a0d0a] text-stone-100 selection:bg-cyan-400 selection:text-black overflow-x-hidden grain">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] -left-32 size-130 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] -right-40 size-105 rounded-full bg-blue-400/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-6 py-12 pb-24">
        {/* Technical Grid Kicker */}
        <div className="absolute inset-0 grid-bg opacity-20 mask-[radial-gradient(ellipse_at_top,black_40%,transparent_80%)] -z-10" />

        {/* WELCOME SECTION - Refined to match placement.engine branding */}
        <section className="reveal mb-12" style={{ animationDelay: "0.1s" }}>
          <WelcomeSection
            user={user}
            onCreateSession={() => setShowCreateModal(true)}
          />
        </section>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* STATS & QUICK ACTIONS (Left Sidebar Style) */}
          <div className="lg:col-span-3 space-y-8 reveal" style={{ animationDelay: "0.2s" }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-4 flex items-center gap-2">
              <span className="text-cyan-400">01 /</span> analytics.log
            </div>
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
          </div>

          {/* ACTIVE SESSIONS (Main Content Area) */}
          <div className="lg:col-span-9 space-y-12 reveal" style={{ animationDelay: "0.3s" }}>
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
                  <span className="text-cyan-400">02 /</span> session.active_pool
                </div>
              </div>
              <ActiveSessions
                sessions={activeSessions}
                isLoading={loadingActiveSessions}
                isUserInSession={isUserInSession}
              />
            </div>

            {/* RECENT HISTORY */}
            <div className="space-y-8 reveal" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
                  <span className="text-cyan-400">03 /</span> recent.session_history
                </div>
              </div>
              <RecentSessions
                sessions={recentSessions?.slice(0, 4)}
                isLoading={loadingRecentSessions}
              />
            </div>
          </div>
        </div>
      </main>
      <div className="max-w-7xl mx-auto w-full px-6 opacity-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-500 to-transparent" />
      </div>
      <Footer />

      {/* MODAL OVERLAY */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </div>
  );
}

export default DashboardPage;