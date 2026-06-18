/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Student, TutorshipRequest, RewardItem, CourseName } from '../types';
import { 
  getTutorships, 
  acceptTutorshipRequest, 
  completeTutorshipSession, 
  getRewards, 
  claimReward,
  getMentors
} from '../lib/storage';
import { 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Calculator, 
  User, 
  Smile, 
  ChevronRight, 
  Sparkles, 
  BookMarked,
  Layers, 
  Pocket, 
  Package 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentorDashboardProps {
  mentorId: string;
  onRefreshStats: () => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentorId, onRefreshStats }) => {
  const [mentor, setMentor] = useState<Student | null>(null);
  const [allRequests, setAllRequests] = useState<TutorshipRequest[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  
  // Accept session temporary state
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');

  // Complete session temporary state
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState(60);

  // Rewards feedback
  const [rewardFeedback, setRewardFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [mentorId]);

  const loadData = () => {
    const mentors = getMentors();
    const current = mentors.find(m => m.id === mentorId) || null;
    setMentor(current);
    setAllRequests(getTutorships());
    setRewards(getRewards());
  };

  const handleAcceptRequestSubmit = (e: React.FormEvent, requestId: string) => {
    e.preventDefault();
    if (!mentor || !schedDate || !schedTime) return;

    acceptTutorshipRequest(
      requestId,
      mentor.id,
      mentor.name,
      schedDate,
      schedTime
    );

    setSchedulingId(null);
    setSchedDate('');
    setSchedTime('');
    loadData();
    onRefreshStats();
  };

  const handleCompleteRequestSubmit = (e: React.FormEvent, requestId: string) => {
    e.preventDefault();
    if (!sessionNotes.trim()) return;

    completeTutorshipSession(
      requestId,
      sessionNotes,
      sessionDuration
    );

    setCompletingId(null);
    setSessionNotes('');
    setSessionDuration(60);
    loadData();
    onRefreshStats(); // Tell parent app to refresh stats (such as points!)
  };

  const handleClaimReward = (rewardId: string) => {
    if (!mentor) return;
    const result = claimReward(mentor.id, rewardId);
    setRewardFeedback(result);
    // Refresh local lists
    loadData();
    onRefreshStats();
    // Dismiss feedback banner after 6 seconds
    setTimeout(() => setRewardFeedback(null), 6000);
  };

  // Helper icons for rewards
  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="h-6 w-6 text-emerald-600" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-blue-600" />;
      case 'BookMarked': return <BookMarked className="h-6 w-6 text-amber-600" />;
      default: return <Package className="h-6 w-6 text-slate-500" />;
    }
  };

  if (!mentor) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Buscando perfil de mentor en la base de datos local...</p>
      </div>
    );
  }

  // Filter requests
  const pendingRequests = allRequests.filter(r => r.status === 'pendiente');
  const myAssignedSessions = allRequests.filter(r => r.mentorId === mentor.id);

  return (
    <div id="mentor-dashboard" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Mentor Header Profile info */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={mentor.avatarUrl} 
              alt={mentor.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-udep-blue"
            />
            <div>
              <p className="text-xs font-semibold text-udep-sky uppercase tracking-wide">{mentor.program} • Ciclo {mentor.cycle}</p>
              <h2 className="font-display font-bold text-xl md:text-2xl text-slate-800">{mentor.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5 italic">"{mentor.bio || 'Voluntariado por un cambio social'}"</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3.5 self-stretch md:self-auto">
            <div className="p-3 bg-emerald-500 text-white rounded-full">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Mis Puntos Acumulados</span>
              <p className="font-mono font-extrabold text-2xl text-emerald-800">{mentor.points || 0} <span className="text-xs font-sans font-medium text-emerald-600">pts</span></p>
              <span className="text-[10px] text-emerald-600">+50 pts por cada asesoría validada</span>
            </div>
          </div>
        </div>
      </div>

      {rewardFeedback && (
        <div className="lg:col-span-3">
          <div className={`p-4 rounded-xl border ${
            rewardFeedback.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <div className="flex gap-2 items-start">
              <Sparkles className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Canje de Recompensa</p>
                <p className="text-xs mt-1">{rewardFeedback.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Izquierda: Bolsa de Solicitudes y mis Tutorías */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bolsa General Pendientes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-udep-blue">Bolsa de Consultas (Becados)</h3>
              <p className="text-xs text-slate-500">Alumnos ingresantes que requieren auxilio académico prioritario.</p>
            </div>
            <Layers className="h-5 w-5 text-udep-sky" />
          </div>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-400">No hay requerimientos pendientes en el sistema. ¡Buen trabajo!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(req => {
                const isAccepting = schedulingId === req.id;
                return (
                  <div key={req.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden transition-all">
                    <span className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
                    
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                            {req.courseName}
                          </span>
                          <span className="text-xs text-slate-400">Publicado {new Date(req.requestedDate).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-800 mt-2">Tema: {req.topic}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-udep-blue/60" /> Solicitado por: <strong>{req.menteeName}</strong>
                        </p>
                      </div>

                      {!isAccepting && (
                        <button 
                          onClick={() => setSchedulingId(req.id)}
                          className="bg-udep-blue hover:bg-udep-sky text-white text-xs font-semibold px-4 py-2 rounded-lg transition-transform hover:scale-105"
                        >
                          Aceptar Asesoría
                        </button>
                      )}
                    </div>

                    {/* Schedule inline form */}
                    <AnimatePresence>
                      {isAccepting && (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={(e) => handleAcceptRequestSubmit(e, req.id)}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">Agendar Fecha y Hora:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Fecha:</label>
                              <input 
                                type="date" 
                                required
                                value={schedDate}
                                onChange={(e) => setSchedDate(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Hora:</label>
                              <input 
                                type="time" 
                                required
                                value={schedTime}
                                onChange={(e) => setSchedTime(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 text-xs">
                            <button 
                              type="button" 
                              onClick={() => setSchedulingId(null)}
                              className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded"
                            >
                              Cancelar
                            </button>
                            <button 
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded"
                            >
                              Confirmar y Agendar
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mis Clases / Tutorías Asignadas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-display font-bold text-base text-udep-blue mb-4 border-b border-slate-100 pb-2">Mis Sesiones Agendadas ({myAssignedSessions.length})</h3>

          {myAssignedSessions.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              Aún no has agendado asesorías. ¡Revisa la Bolsa de Consultas arriba!
            </div>
          ) : (
            <div className="space-y-4">
              {myAssignedSessions.map(tut => {
                const isCompleting = completingId === tut.id;
                return (
                  <div key={tut.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                    <span className={`absolute top-0 left-0 bottom-0 w-1 ${
                      tut.status === 'programado' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`} />

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-blue-700 bg-blue-50 border border-blue-50 px-2 py-0.5 rounded">
                            {tut.courseName}
                          </span>
                          <span className="text-[10px] text-slate-400">ID: {tut.id}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-800 mt-2">Tema: {tut.topic}</h4>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" /> Alumno asignado: <strong>{tut.menteeName}</strong>
                        </p>
                        
                        {tut.status === 'programado' && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" /> Agendado para el <strong>{tut.scheduledDate}</strong> a las <strong>{tut.scheduledTime}</strong>
                          </p>
                        )}
                      </div>

                      {tut.status === 'programado' && !isCompleting && (
                        <button 
                          onClick={() => setCompletingId(tut.id)}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                        >
                          Finalizar & Guardar Notas
                        </button>
                      )}

                      {tut.status === 'completado' && (
                        <div className="text-right text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                            <CheckCircle className="h-3.5 w-3.5" /> Completada (+50 pts)
                          </span>
                          <p className="mt-1">Duración: {tut.durationMinutes} min</p>
                        </div>
                      )}
                    </div>

                    {/* Completion Notes logs inside card */}
                    <AnimatePresence>
                      {isCompleting && (
                        <motion.form 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onSubmit={(e) => handleCompleteRequestSubmit(e, tut.id)}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Registrar Resultado de Tutoría:</p>
                          <div className="space-y-3 mb-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Apuntes Académicos / Desempeño del Becado:</label>
                              <textarea
                                rows={2}
                                required
                                placeholder="Ej. El estudiante entendió derivadas por partes, completamos 3 problemas. Requiere repasar identidades trigonométricas."
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded p-2.5 text-xs text-slate-800 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Duración (minutos):</label>
                              <select 
                                value={sessionDuration}
                                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                              >
                                <option value="45">45 min</option>
                                <option value="60">1 hora (60 min)</option>
                                <option value="90">1.5 horas (90 min)</option>
                                <option value="120">2 horas (120 min)</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 text-xs">
                            <button 
                              type="button" 
                              onClick={() => setCompletingId(null)}
                              className="px-3 py-1.5 text-slate-500"
                            >
                              Cancelar
                            </button>
                            <button 
                              type="submit"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded flex items-center gap-1 shadow-sm"
                            >
                              Finalizar Asesoría
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {tut.status === 'completado' && tut.sessionNotes && (
                      <div className="mt-3 pt-2 border-t border-slate-100 bg-white/50 p-2.5 rounded text-xs text-slate-600">
                        <strong className="text-slate-700">Informe del mentor:</strong> "{tut.sessionNotes}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tienda de Canje / Hub Logístico (Inventario de Calculadoras y Libros) */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
            <Pocket className="h-5 w-5 text-udep-gold" />
            <div>
              <h3 className="font-display font-bold text-base text-udep-blue">Tienda de Canjes</h3>
              <p className="text-[11px] text-slate-400">Canjea tus puntos por herramientas físicas del proyecto.</p>
            </div>
          </div>

          <div className="space-y-4">
            {rewards.map(item => {
              const canAfford = (mentor.points || 0) >= item.pointsCost;
              const hasStock = item.availableStock > 0;
              return (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 flex-shrink-0">
                    {getRewardIcon(item.imageIcon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-slate-800 leading-tight">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {item.pointsCost} pts
                      </span>
                      
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Package className="h-3 w-3" /> Stock: {item.availableStock} / {item.originalStock}
                      </span>
                    </div>

                    <button
                      disabled={!canAfford || !hasStock}
                      onClick={() => handleClaimReward(item.id)}
                      className={`w-full mt-3 flex items-center justify-center py-1.5 rounded text-xs font-semibold transition-all ${
                        canAfford && hasStock
                          ? 'bg-udep-blue text-white hover:bg-udep-sky cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {!hasStock ? 'Sin Stock' : !canAfford ? 'Puntos Insuficientes' : 'Solicitar Material'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
