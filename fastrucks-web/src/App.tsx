import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { SupplierDashboard } from './components/supplier/SupplierDashboard';
import { TransporterDashboard } from './components/transporter/TransporterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Truck, ShieldCheck, Smartphone, MapPin, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header />

      {/* Main Role Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentUser.role === 'supplier' && <SupplierDashboard />}
        {currentUser.role === 'transporter' && <TransporterDashboard />}
        {currentUser.role === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Truck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Fastrucks Platform
            </span>
            <span>• Case of Large Vehicle Transporters in Kenya</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Traffic Act CAP 403 Vetted (Age ≥ 28)
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              M-Pesa Daraja Escrow
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Northern Corridor Telemetry
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              Digital e-POD PIN Sign-off
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
