import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Users, ShieldAlert, Award } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: 'app' | 'budget' | 'theory';
  setActiveTab: (tab: 'app' | 'budget' | 'theory') => void;
  resolvedAlertsCount: number;
  totalAlertsCount: number;
}

export default function Header({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  resolvedAlertsCount,
  totalAlertsCount
}: HeaderProps) {
  return (
    <header className="bg-udep-blue-dark text-white shadow-xl border-b-4 border-udep-yellow" id="app-header">
      {/* Top Welcome bar with UDEP branding */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-udep-yellow p-2 rounded-lg text-udep-blue-dark shadow-md flex items-center justify-center">
            <GraduationCap className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight font-sans flex items-center gap-2">
              RED SAB <span className="text-udep-yellow text-md bg-white/10 px-2 py-0.5 rounded text-xs font-mono">DIGITAL</span>
            </h1>
            <p className="text-xs text-slate-300 font-sans">
              Ecosistema de Tutoría Horizontal y Alerta Temprana • Universidad de Piura (UDEP)
            </p>
          </div>
        </div>

        {/* Action Tabs: App Principal, Presupuesto S/. 5,000, Marco Lógico */}
        <div className="flex bg-slate-800/60 p-1 rounded-xl border border-white/10 text-xs">
          <button
            id="tab-app"
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'app'
                ? 'bg-udep-yellow text-udep-blue-dark font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Plataforma PWA
          </button>
          <button
            id="tab-budget"
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'budget'
                ? 'bg-udep-yellow text-udep-blue-dark font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Presupuesto (S/. 5,000)
          </button>
          <button
            id="tab-theory"
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
              activeTab === 'theory'
                ? 'bg-udep-yellow text-udep-blue-dark font-bold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Marco Lógico y Diagnóstico
          </button>
        </div>
      </div>

      {/* Main Stats bar representing Slide 8 logical KPIs */}
      <div className="bg-slate-950/40 text-slate-200 border-t border-white/5 py-2.5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/40">
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-slate-400">Meta Permanencia</div>
            <div className="text-sm md:text-base font-bold text-emerald-400 font-mono">98% Retención</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-slate-400">Objetivo Académico</div>
            <div className="text-sm md:text-base font-bold text-udep-yellow font-mono">+2.5 Promedio</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-slate-400">Ratio Mentor/Becado</div>
            <div className="text-sm md:text-base font-bold text-sky-400 font-mono text-center">1 : 4 Horizontal</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-slate-400">Semaforización Bienestar</div>
            <div className="text-sm md:text-base font-bold text-amber-400 font-mono">
              {totalAlertsCount > 0 ? (
                <span>{resolvedAlertsCount}/{totalAlertsCount} Resuelto (&lt;24h)</span>
              ) : (
                <span>100% Atención</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Selector when in App View */}
      {activeTab === 'app' && (
        <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-500 font-medium font-sans">
              Simular Rol de la Plataforma para interactuar con el MVP:
            </span>
            <div className="flex gap-2 p-1 bg-slate-200/60 rounded-xl" id="role-selector">
              <button
                id="role-mentee"
                onClick={() => setCurrentRole(UserRole.Mentee)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === UserRole.Mentee
                    ? 'bg-udep-blue-light text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-300/45'
                }`}
              >
                <Users className="h-4 w-4" />
                Estudiante Becado (Mentee)
              </button>
              <button
                id="role-mentor"
                onClick={() => setCurrentRole(UserRole.Mentor)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === UserRole.Mentor
                    ? 'bg-udep-blue-light text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-300/45'
                }`}
              >
                <Award className="h-4 w-4" />
                Alumno Mentor (Hermano Mayor)
              </button>
              <button
                id="role-bienestar"
                onClick={() => setCurrentRole(UserRole.Bienestar)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentRole === UserRole.Bienestar
                    ? 'bg-red-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-300/45'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                Oficina de Bienestar (Monitoreo)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
