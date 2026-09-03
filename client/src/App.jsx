import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext.jsx';
import { OfflineProvider } from './context/OfflineContext.jsx';
import { TripProvider } from './context/TripContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { BottomNav } from './components/layout/BottomNav.jsx';
import { EmergencySOS } from './components/layout/EmergencySOS.jsx';
import { AdaptationToast } from './components/layout/AdaptationToast.jsx';
import { AuthModal } from './components/auth/AuthModal.jsx';

import { HomePage } from './pages/HomePage.jsx';
import { ExploreIndiaPage } from './pages/ExploreIndiaPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { ExplorePage } from './pages/ExplorePage.jsx';
import { PlannerPage } from './pages/PlannerPage.jsx';
import { TripDetailPage } from './pages/TripDetailPage.jsx';
import { MyTripsPage } from './pages/MyTripsPage.jsx';
import { HeritagePage } from './pages/HeritagePage.jsx';
import { SafetyPage } from './pages/SafetyPage.jsx';
import { DataAccuracyPage } from './pages/DataAccuracyPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';

export default function App() {
  const [sosModalOpen, setSosModalOpen] = useState(false);

  return (
    <SocketProvider>
      <OfflineProvider>
        <AuthProvider>
          <TripProvider>
            <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 selection:bg-terracotta-100 selection:text-terracotta-800">
              
              {/* Top Navigation */}
              <Navbar onOpenSos={() => setSosModalOpen(true)} />

              {/* Main Content View */}
              <main className="flex-1 pb-24 lg:pb-0">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore-india" element={<ExploreIndiaPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/trip" element={<MyTripsPage />} />
                  <Route path="/trip/detail" element={<TripDetailPage />} />
                  <Route path="/heritage" element={<HeritagePage />} />
                  <Route path="/safety" element={<SafetyPage onOpenSos={() => setSosModalOpen(true)} />} />
                  <Route path="/data-accuracy" element={<DataAccuracyPage />} />
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                </Routes>
              </main>

              {/* Real-time Event Adaptation Notification Toast */}
              <AdaptationToast />

              {/* Global Authentication Modal */}
              <AuthModal />

              {/* Universal Emergency SOS Modal */}
              <EmergencySOS 
                isOpen={sosModalOpen} 
                onClose={() => setSosModalOpen(false)} 
              />

              {/* Mobile Bottom Navigation */}
              <BottomNav onOpenSos={() => setSosModalOpen(true)} />

              {/* Global Footer */}
              <Footer />

            </div>
          </TripProvider>
        </AuthProvider>
      </OfflineProvider>
    </SocketProvider>
  );
}
