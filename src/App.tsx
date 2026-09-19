import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy loaded routes for optimal bundle splitting and performance (Efficiency)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Quests = lazy(() => import('./pages/Quests').then(m => ({ default: m.Quests })));
const BossGuide = lazy(() => import('./pages/BossGuide').then(m => ({ default: m.BossGuide })));
const BuildCreator = lazy(() => import('./pages/BuildCreator').then(m => ({ default: m.BuildCreator })));
const HintsPage = lazy(() => import('./pages/HintsPage').then(m => ({ default: m.HintsPage })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

// Gaming-themed route loading indicator
const RouteLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
    <div className="relative">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-cyan-500/30 border border-purple-500/40 flex items-center justify-center animate-pulse">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
      <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-sm -z-10 animate-pulse" />
    </div>
    <span className="text-xs text-slate-400 font-medium tracking-wide">
      Loading Quest Matrix...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GameProvider>
          <Layout>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/quests" element={<Quests />} />
                <Route path="/bosses" element={<BossGuide />} />
                <Route path="/builds" element={<BuildCreator />} />
                <Route path="/hints" element={<HintsPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </GameProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
