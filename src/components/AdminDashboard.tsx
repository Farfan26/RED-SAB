/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, TutorshipRequest, CourseName } from '../types';
import { 
  getBecados, 
  getMentors, 
  getTutorships, 
  getPsychoAlerts, 
  updatePsychoAlertStatus, 
  createTutorshipRequest,
  acceptTutorshipRequest,
  PsychoAlert
} from '../lib/storage';
import { 
  ShieldAlert, 
  Smile, 
  Percent, 
  CheckCircle, 
  Activity, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Search, 
  ArrowRight, 
  HeartHandshake,
  Clock,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  onRefreshStats: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onRefreshStats }) => {
  const [becados, setBecados] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Student[]>([]);
  const [tutorships, setTutorships] = useState<TutorshipRequest[]>([]);
  const [psychoAlerts, setPsychoAlerts] = useState<PsychoAlert[]>([]);
  
  // Follow-up notes on psych alarms
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [followupNotes, setFollowupNotes] = useState('');

  // Matchmaker form state
  const [matchStudentId, setMatchStudentId] = useState('');
  const [matchMentorId, setMatchMentorId] = useState('');
  const [matchCourse, setMatchCourse] = useState<CourseName>(CourseName.CalculoI);
  const [matchTopic, setMatchTopic] = useState('');
  const [matchSuccess, setMatchSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBecados(getBecados());
    setMentors(getMentors());
    setTutorships(getTutorships());
    setPsychoAlerts(getPsychoAlerts());
  };

  const handleResolveAlert = (e: React.FormEvent, alertId: string) => {
    e.preventDefault();
    if (!followupNotes.trim()) return;

    updatePsychoAlertStatus(alertId, 'atendido', followupNotes);
    setResolvingAlertId(null);
    setFollowupNotes('');
    loadData();
    onRefreshStats();
  };

  const handleAutoMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchStudentId || !matchMentorId || !matchTopic.trim()) return;

    const selectedBecado = becados.find(b => b.id === matchStudentId);
    const selectedMentor = mentors.find(m => m.id === matchMentorId);

    if (!selectedBecado || !selectedMentor) return;

    // Create a new tutorship request representation
    const req = createTutorshipRequest({
      menteeId: selectedBecado.id,
      menteeName: selectedBecado.name,
      courseName: matchCourse,
      topic: matchTopic
    });

    // Accept it on the spot
    acceptTutorshipRequest(
      req.id,
      selectedMentor.id,
      selectedMentor.name,
      new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      "16:00"
    );

    setMatchSuccess(true);
    setMatchTopic('');
    setTimeout(() => setMatchSuccess(false), 5000);
    loadData();
    onRefreshStats();
  };

  // KPI Calculations
  const totalCompletedTutorships = tutorships.filter(t => t.status === 'completado').length + 120; // 120 historic
  const greenStudents = becados.filter(s => s.status === 'verde').length;
  const totalStudents = becados.length;
  const retentionRate = totalStudents > 0 ? Math.round(((greenStudents + becados.filter(s => s.status === 'amarillo').length) / totalStudents) * 100) : 100;
  
  const pendingSpecialAlerts = psychoAlerts.filter(a => a.status === 'pendiente');

  return (
    <div id="admin-dashboard" className="space-y-6 p-4">
      {/* 3 bento grids of KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-udep-blue rounded-xl">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tasa de Permanencia</span>
            <h3 className="font-mono font-extrabold text-2xl text-slate-800">{retentionRate}%</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Semáforo Amarillo o Verde. Meta: &gt;98%</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asesorías Validadas</span>
            <h3 className="font-mono font-extrabold text-2xl text-slate-800">{totalCompletedTutorships}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Acumulado anual (Fondo UDEP)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Alertas Psicopedagógicas</span>
            <h3 className="font-mono font-extrabold text-2xl text-slate-800">{pendingSpecialAlerts.length} <span className="text-sm font-sans font-normal text-rose-500">activas</span></h3>
            <p className="text-[11px] text-slate-500 mt-0.5">SLA de Respuesta: &lt;24 horas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitor Alumnos en Semáforo Rojo/Amarillo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alertas de bienestar psicopedagógico */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <div>
                <h3 className="font-display font-bold text-base text-slate-800">Alertas de Contención Psicopedagógica</h3>
                <p className="text-xs text-slate-400">Mensajes de auxilio emitidos directamente por alumnos becados.</p>
              </div>
            </div>

            {psychoAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No hay alertas de vulnerabilidad pendientes.</p>
            ) : (
              <div className="space-y-4">
                {psychoAlerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 relative">
                    <span className={`absolute top-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      alert.status === 'atendido' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 pulse-ring-active'
                    }`}>
                      {alert.status === 'atendido' ? 'Atendido' : 'Pendiente Crítico'}
                    </span>

                    <h4 className="font-semibold text-sm text-slate-800 pr-16">{alert.studentName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Solicitado: {new Date(alert.date).toLocaleString()}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 bg-white/70 p-2.5 rounded-lg border border-rose-50 italic">
                      "{alert.reason}"
                    </p>

                    {alert.notes && (
                      <div className="mt-3 pt-2 text-xs border-t border-slate-100">
                        <strong className="text-slate-800">Informe de consejero: </strong> 
                        <span className="text-slate-600">"{alert.notes}"</span>
                      </div>
                    )}

                    {alert.status === 'pendiente' && alert.id !== resolvingAlertId && (
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => setResolvingAlertId(alert.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded"
                        >
                          Atender & Registrar Cita
                        </button>
                      </div>
                    )}

                    {/* Report action form */}
                    <AnimatePresence>
                      {resolvingAlertId === alert.id && (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={(e) => handleResolveAlert(e, alert.id)}
                          className="mt-4 pt-3 border-t border-slate-100 space-y-2.5"
                        >
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">Informe de Resolución/Cita agendada:</label>
                            <textarea
                              rows={2.5}
                              required
                              placeholder="Ej: Se agendó sesión de consejería presencial con el psicólogo de guardia para mañana a las 10:00. Se coordinará reforzamiento de cálculo."
                              value={followupNotes}
                              onChange={(e) => setFollowupNotes(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded p-2 text-xs focus:outline-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2 text-xs">
                            <button 
                              type="button" 
                              onClick={() => setResolvingAlertId(null)}
                              className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded"
                            >
                              Cancelar
                            </button>
                            <button 
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 font-semibold rounded"
                            >
                              Archivar como Atendido
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List of general students with visual status indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-display font-bold text-base text-slate-800 mb-3 border-b border-slate-100 pb-2">Control General de Alumnos Becados</h3>
            
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[350px]">
              {becados.map(becado => (
                <div key={becado.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={becado.avatarUrl} 
                      alt={becado.name} 
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{becado.name}</h4>
                      <p className="text-slate-400 text-[11px]">{becado.program} • Ciclo {becado.cycle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        becado.status === 'rojo' 
                          ? 'bg-rose-100 text-rose-800' 
                          : becado.status === 'amarillo'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Prom: {becado.avgGrade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel General Derecha: Algoritmo Inteligente de Emparejamiento por UDEP Admin */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
              <Sparkles className="h-5 w-5 text-udep-gold" />
              <div>
                <h3 className="font-display font-bold text-base text-udep-blue">Asignación Inteligente</h3>
                <p className="text-[11px] text-slate-400">Coordinar y forzar emparejamientos Alumno-Mentor.</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Vincula manualmente a un alumno cachimbo en riesgo directamente con un hermano mayor basándote en la compatibilidad de cursos de la Universidad de Piura.
            </p>

            {matchSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-xs leading-normal flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span><strong>¡Emparejamiento Exitoso!</strong> Se ha programado la clase en la agenda de ambos. El mentor Dany Joel recibirá una notificación para preparar el material.</span>
              </div>
            ) : (
              <form onSubmit={handleAutoMatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cachimbo Becado:</label>
                  <select
                    required
                    value={matchStudentId}
                    onChange={(e) => setMatchStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700"
                  >
                    <option value="">-- Seleccionar Cachimbo --</option>
                    {becados.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.program} - Prom: {b.avgGrade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mentor Asignable (Hermano Mayor):</label>
                  <select
                    required
                    value={matchMentorId}
                    onChange={(e) => setMatchMentorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700"
                  >
                    <option value="">-- Seleccionar Mentor --</option>
                    {mentors.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Ciclo {m.cycle} - Puntos: {m.points})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Curso Académico:</label>
                  <select 
                    value={matchCourse}
                    onChange={(e) => setMatchCourse(e.target.value as CourseName)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700"
                  >
                    {Object.values(CourseName).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Capítulo o Tema Temática de Urgencia:</label>
                  <input
                    type="text"
                    required
                    maxLength={70}
                    placeholder="Ej. Límites trigonométricos y asíntotas parciales"
                    value={matchTopic}
                    onChange={(e) => setMatchTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-udep-blue hover:bg-udep-sky text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
                >
                  Confirmar Acoplamiento <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
