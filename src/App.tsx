/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { initializeDB, getBecados, getMentors } from './lib/storage';
import { RoleType, Student } from './types';
import { RoleSelector } from './components/RoleSelector';
import { BecadoDashboard } from './components/BecadoDashboard';
import { MentorDashboard } from './components/MentorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ResourceHub } from './components/ResourceHub';
import { Login } from './components/Login';
import { 
  Heart, 
  HelpCircle, 
  Share2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  FolderLock, 
  GraduationCap, 
  BookOpen, 
  School,
  Compass,
  FileCheck,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('redsab_is_logged') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<RoleType>(() => {
    return (localStorage.getItem('redsab_current_role') as RoleType) || 'becado';
  });

  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    return localStorage.getItem('redsab_selected_user_id') || 'becado-1';
  });

  const [userProfile, setUserProfile] = useState<Student | null>(null);
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resources'>('dashboard');
  
  // Accordion details for the structural PDF study documentation
  const [showDocProject, setShowDocProject] = useState(false);

  // Trigger state update
  const [statsTrigger, setStatsTrigger] = useState(0);

  useEffect(() => {
    // Seed and bootstrap local database
    initializeDB();
    refreshUserData();
  }, [currentRole, selectedUserId, statsTrigger, isLoggedIn]);

  const refreshUserData = () => {
    if (!isLoggedIn) {
      setUserProfile(null);
      return;
    }

    if (currentRole === 'becado') {
      const becados = getBecados();
      const current = becados.find(b => b.id === selectedUserId) || becados[0];
      setUserProfile(current || null);
    } else if (currentRole === 'mentor') {
      const mentors = getMentors();
      const current = mentors.find(m => m.id === selectedUserId) || mentors[0];
      setUserProfile(current || null);
    } else {
      setUserProfile(null); // admin doesn't require individual profile
    }
  };

  const handleLoginSuccess = (role: RoleType, studentId: string) => {
    setCurrentRole(role);
    setSelectedUserId(studentId);
    setIsLoggedIn(true);
    localStorage.setItem('redsab_is_logged', 'true');
    localStorage.setItem('redsab_current_role', role);
    localStorage.setItem('redsab_selected_user_id', studentId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('redsab_is_logged');
    localStorage.removeItem('redsab_current_role');
    localStorage.removeItem('redsab_selected_user_id');
  };

  const handleRoleChange = (role: RoleType, userId: string) => {
    setCurrentRole(role);
    setSelectedUserId(userId);
    localStorage.setItem('redsab_current_role', role);
    localStorage.setItem('redsab_selected_user_id', userId);
  };

  const forceRefresh = () => {
    setStatsTrigger(prev => prev + 1);
  };

  // If the user is not authenticated in simulation, show the beautiful Login portal
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Role Selection simulated sticky header */}
      <RoleSelector 
        currentRole={currentRole}
        selectedUserId={selectedUserId}
        onRoleChange={handleRoleChange}
      />

      {/* Main Banner / Content Header */}
      <header id="app-hero-display" className="bg-white border-b border-slate-200 py-6 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <School className="h-10 w-10 text-udep-blue flex-shrink-0 mt-1" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-udep-blue/10 text-udep-blue px-2.5 py-0.5 rounded-full">
                  Semestre Académico 2026-I
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-udep-wine/10 text-udep-wine px-2.5 py-0.5 rounded-full">
                  Ingeniería para el Desarrollo
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  SAB Activo 🟢
                </span>
              </div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-800 tracking-tight mt-1">
                Red SAB Digital (PWA)
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Plataforma de estudio compartido, emparejamiento inteligente y seguimiento académico preventivo por semáforos, diseñado por y para estudiantes becados de la <strong>Universidad de Piura (UDEP)</strong>.
              </p>
            </div>
          </div>

          {/* Logged in simulation profile card wrapper with log out action */}
          {userProfile && (
            <div className="bg-slate-55/45 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 max-w-sm w-full md:w-auto shadow-xs transition-colors">
              <div className="flex items-center gap-3.5">
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.name} 
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800 leading-none">{userProfile.name}</p>
                  <p className="text-slate-400 mt-1 leading-none">{userProfile.program}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block w-2 w-2 h-2 rounded-full ${
                      userProfile.status === 'verde' ? 'bg-emerald-500' : userProfile.status === 'amarillo' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <span className="font-semibold text-slate-500">
                      {userProfile.role === 'becado' ? `Cachimbos Prom: ${userProfile.avgGrade}` : `Mentor Pts: ${userProfile.points || 0}`}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                title="Cerrar sesión de simulación"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {currentRole === 'bienestar' && (
            <div className="bg-slate-55/45 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 max-w-sm w-full md:w-auto shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-udep-sky/10 text-udep-sky rounded-lg">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800 leading-none">Coordinador Principal</p>
                  <p className="text-slate-400 mt-1 leading-none">Bienestar Universitario UDEP</p>
                  <span className="inline-block mt-2 font-bold text-indigo-700">Vista General de Control</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                title="Cerrar sesión de simulación"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs / Panel Navigation */}
      <div id="tabs-navigation-panel" className="bg-white border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-1.5 pt-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'border-udep-blue text-udep-blue font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Compass className="h-4 w-4" />
                Panel de Operaciones
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`pb-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'resources'
                  ? 'border-resources text-udep-blue font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                Biblioteca & Drive Abierto
              </span>
            </button>
          </div>

          <button 
            onClick={() => setShowDocProject(!showDocProject)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-udep-sky py-1 px-3 rounded-lg border border-slate-200 bg-slate-50/50"
          >
            <Info className="h-4 w-4" />
            {showDocProject ? 'Ocultar Documentación' : 'Ver Marco Teórico UDEP'}
          </button>
        </div>
      </div>

      {/* Doc Project study details (Frame analysis) */}
      <AnimatePresence>
        {showDocProject && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-100 border-b border-slate-200/60"
          >
            <div className="max-w-7xl mx-auto p-5 text-xs text-slate-600 leading-relaxed grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <FileCheck className="h-4 w-4 text-udep-wine" /> Problema Central Identificado
                </h4>
                <p className="mt-1.5">
                  Elevado riesgo de deserción universitaria y bajo rendimiento académico en estudiantes becados de los primeros ciclos (Beca 18, vulnerabilidad socioeconómica) en el Campus Piura (UDEP).
                </p>
                <p className="mt-1 font-semibold text-slate-700">Subcausas críticas:</p>
                <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                  <li>Asimetría en bases de colegios de origen.</li>
                  <li>Invalidez logística de cubículos tradicionales por timidez o estigma social de los ingresantes.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <Compass className="h-4 w-4 text-udep-blue" /> Alternativa Seleccionada (B)
                </h4>
                <p className="mt-1.5">
                  Lanzamiento de una PWA de estudio compartido y control preventivo de notas apoyado en el voluntariado de alumnos destacados de ciclos superiores de la UDEP para romper la barrera vertical y el estigma social de petición de ayuda.
                </p>
                <p className="mt-1 font-semibold text-slate-700">Canales de respuesta:</p>
                <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                  <li>Semáforo de notas con simulación de promedios.</li>
                  <li>Algoritmo horizontal de emparejamiento.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <Heart className="h-4 w-4 text-rose-600" /> Teoría del Cambio del Proyecto
                </h4>
                <p className="mt-1.5">
                  <strong>SI</strong> organizamos el voluntariado de ciclos superiores brindándoles una PWA de seguimiento semáforo de notas de los ingresantes:
                </p>
                <p className="mt-1.5">
                  <strong>ENTONCES</strong> eliminaremos las demoras de cubículos, disminuiremos la timidez de pedir auxilios y nivelaremos con resiliencia horizontal a los cachimbos antes de los exámenes clasificatorios de la Facultad.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main id="main-app-content" className="flex-1 max-w-7xl w-full mx-auto pb-12">
        <div className="mt-4">
          {activeTab === 'resources' ? (
            <ResourceHub currentStudent={userProfile || getMentors()[0]} />
          ) : (
            <div id="dashboard-conditional-render">
              {currentRole === 'becado' && userProfile && (
                <BecadoDashboard 
                  student={userProfile} 
                  onRefreshStats={forceRefresh}
                />
              )}

              {currentRole === 'mentor' && userProfile && (
                <MentorDashboard 
                  mentorId={userProfile.id} 
                  onRefreshStats={forceRefresh}
                />
              )}

              {currentRole === 'bienestar' && (
                <AdminDashboard 
                  onRefreshStats={forceRefresh}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Integrated Page Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-400">
        <div id="footer-inner-content" className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Universidad de Piura (UDEP) - Ingeniería para el Desarrollo. Diseñado por Grupo 1 - IPD.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Docente: Dr. Ing. Erick Miñan</span>
            <span>Semestre 2026-I</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
