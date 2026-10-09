import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Truck,
  Building2,
  Shield,
  RotateCcw,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Check,
  Smartphone,
  QrCode,
} from 'lucide-react';
import { PushToPhoneModal } from './PushToPhoneModal';

export const Header: React.FC = () => {
  const { currentUser, users, setCurrentUserById, setCurrentRole, resetAllData } = useApp();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const roles: Array<{ role: UserRole; label: string; icon: React.ReactNode }> = [
    { role: 'supplier', label: 'Supplier (Shipper)', icon: <Building2 className="w-4 h-4" /> },
    { role: 'transporter', label: 'Transporter (Driver)', icon: <Truck className="w-4 h-4" /> },
    { role: 'admin', label: 'System Admin', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Logo & Platform Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25">
                <Truck className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-slate-100">
                    FasTrucks
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-1.5 py-0.2 rounded">
                    KENYA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Heavy Commercial Freight &amp; Vetted Transporter Platform
                </p>
              </div>
            </div>

            {/* Role Switcher Tabs */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              {roles.map(({ role, label, icon }) => {
                const isActive = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => setCurrentRole(role)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Action: Push to phone + User profile selector + Reset */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Push to Phone / Install Button */}
              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                title="Install / Push to Mobile Phone"
              >
                <Smartphone className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Push to Phone</span>
                <span className="sm:hidden">App</span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-emerald-950">
                  PWA
                </span>
              </button>

              {/* Quick Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition shadow-sm"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-scale-up">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Switch Demo Persona
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {users.map((u) => {
                        const isSelected = u.id === currentUser.id;
                        return (
                          <button
                            key={u.id}
                            onClick={() => {
                              setCurrentUserById(u.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition ${
                              isSelected ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                                {u.name}
                                <span className="text-[10px] font-normal uppercase text-slate-400">
                                  ({u.role})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {u.businessName || u.vehicleType || u.email}
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-amber-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Seed Button */}
              <button
                onClick={() => {
                  if (window.confirm('Reset Fastrucks to initial thesis demo data?')) {
                    resetAllData();
                  }
                }}
                title="Reset Demo Data"
                className="p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 text-slate-400 hover:text-rose-600 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Role Switcher bar */}
          <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800">
            {roles.map(({ role, label, icon }) => {
              const isActive = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {icon}
                  <span>{role}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Push to Phone Modal */}
      <PushToPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </>
  );
};
