import React, { useState } from 'react';
import {
  ShieldCheck,
  Bell,
  Search,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Award,
} from 'lucide-react';
import { useSourcing } from '../../context/SourcingContext';
import { RoleType } from '../../types';
import { USERS } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    currentUser,
    notifications,
    markNotificationsRead,
    resetDemoData,
    activeEvent,
    loadPresetTrack,
  } = useSourcing();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRoleChange = (role: RoleType) => {
    setActiveRole(role);
    setIsRoleDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-[#172447] text-white border-b border-[#233564] px-4 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A99A] to-[#0d7c71] flex items-center justify-center shadow-md">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">
              Autonomous Sourcing Agent
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#00A99A]/20 text-[#00E5D0] px-2 py-0.5 rounded border border-[#00A99A]/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5D0] animate-pulse"></span>
              Level 2 Autonomy · Demo
            </span>
          </div>
          <p className="text-xs text-slate-300 hidden md:block">
            Competitive sourcing for the 80% of transactions we never source today
          </p>
        </div>
      </div>

      {/* Preset Quick Sourcing Switcher & Search */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="bg-[#0f1830] text-xs px-3 py-1.5 rounded-md border border-[#233564] text-slate-300 flex items-center gap-2">
          <span className="text-slate-400 font-medium">Quick Scenarios:</span>
          <button
            onClick={() => loadPresetTrack('repeat')}
            className={`px-2 py-0.5 rounded text-xs transition ${
              activeEvent.id === 'evt_chair_repeat'
                ? 'bg-[#00A99A] text-white font-semibold shadow'
                : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            Track A: 50 Chairs (Repeat)
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => loadPresetTrack('cold_start')}
            className={`px-2 py-0.5 rounded text-xs transition ${
              activeEvent.id === 'evt_cold_start'
                ? 'bg-[#00A99A] text-white font-semibold shadow'
                : 'hover:bg-white/10 text-slate-300'
            }`}
          >
            Track B: Lab Calibration (Cold-Start)
          </button>
        </div>
      </div>

      {/* Right controls: Notifications, Role Switcher, Reset */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          title="Reset demo data to initial state"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              if (!isNotifOpen) markNotificationsRead();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white relative transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F4A44C] text-[#172447] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="bg-[#172447] text-white px-4 py-3 flex items-center justify-between border-b border-[#233564]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00A99A]" />
                  <span className="font-semibold text-sm">System & Supplier Notifications</span>
                </div>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-300">
                  {notifications.length} events
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs flex items-start gap-2.5 transition ${
                        !n.isRead ? 'bg-teal-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-[#00A99A]" />}
                        {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-slate-600 mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2.5 bg-[#0e172e] hover:bg-[#1f2d54] border border-[#2e4075] px-3 py-1.5 rounded-lg transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-[#00A99A]"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00A99A]/20 text-[#00E5D0]">
                  {currentUser.badge}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                {currentUser.title}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Switch Active Persona
                </span>
              </div>
              <div className="p-1 divide-y divide-slate-100">
                {(Object.keys(USERS) as RoleType[]).map((roleKey) => {
                  const u = USERS[roleKey];
                  const isSelected = activeRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleChange(roleKey)}
                      className={`w-full p-2.5 flex items-center gap-3 text-left rounded-lg transition ${
                        isSelected ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {u.name}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              roleKey === 'maya'
                                ? 'bg-blue-100 text-blue-700'
                                : roleKey === 'priya'
                                ? 'bg-teal-100 text-teal-800'
                                : roleKey === 'alex'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {u.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{u.title}</div>
                        <div className="text-[10px] text-slate-400 italic mt-0.5 truncate">
                          {u.spendBook}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
