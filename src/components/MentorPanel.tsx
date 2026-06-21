import React, { useState } from 'react';
import { Mentor, Student, Course } from '../types';
import { Award, Clock, Users, BookOpen, CheckCircle, Plus, Send, Heart, Calendar } from 'lucide-react';

interface MentorPanelProps {
  mentor: Mentor;
  allMentees: Student[];
  allCourses: Course[];
  onLogHours: (mentorId: string, hours: number, description: string) => void;
}

export default function MentorPanel({
  mentor,
  allMentees,
  allCourses,
  onLogHours
}: MentorPanelProps) {
  // Local state to log tutoring session
  const [selectedMenteeId, setSelectedMenteeId] = useState<string>(mentor.menteeIds[0] || 'all');
  const [sessionHours, setSessionHours] = useState<number>(2);
  const [sessionCourse, setSessionCourse] = useState<string>(allCourses[0]?.name || 'Cálculo I');
  const [sessionSummary, setSessionSummary] = useState<string>('');
  const [showLogFeedback, setShowLogFeedback] = useState<boolean>(false);

  // Volunteer hour goals progress
  const hourGoal = 60;
  const progressPercent = Math.min(100, Math.round((mentor.horasVoluntariado / hourGoal) * 100));

  // Find assigned mentees
  const assignedMentees = allMentees.filter(m => mentor.menteeIds.includes(m.id));

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionSummary.trim() || sessionHours <= 0) return;
    
    // Trigger hour logging
    const targetName = selectedMenteeId === 'all' 
      ? 'Grupo Completo' 
      : allMentees.find(m => m.id === selectedMenteeId)?.name || 'Estudiante';
    const detail = `Tutoría de ${sessionCourse} dictada a ${targetName}: ${sessionSummary}`;
    
    onLogHours(mentor.id, sessionHours, detail);
    
    // Clear & show feedback
    setSessionSummary('');
    setShowLogFeedback(true);
    setTimeout(() => setShowLogFeedback(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6" id="mentor-panel">
      
      {/* LEFT COLUMN: Mentor Profile, Hour Accrual */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Mentor Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden" id="mentor-profile">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-6 translate-x-6"></div>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white font-bold text-center flex items-center justify-center text-lg shadow-md">
              {mentor.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">{mentor.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{mentor.carrera}</p>
              <span className="text-[10px] mt-1.5 inline-block px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">Ciclo {mentor.ciclo} • Académico Superior</span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {/* Volunteer hours accredited info */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Horas convalidadas: <strong className="text-slate-800">{mentor.horasVoluntariado} h</strong>
                </span>
                <span className="text-slate-400 font-mono text-xxs">Meta: {hourGoal}h</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <span className="text-xxs text-slate-400 mt-1 block">Faltan {Math.max(0, hourGoal - mentor.horasVoluntariado)} horas para validar tu voluntariado oficial del período.</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-center">
              <div>
                <span className="text-xxs uppercase text-slate-400 font-semibold block">Mentees</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">
                  {assignedMentees.length} / {mentor.maxMentees}
                </span>
              </div>
              <div>
                <span className="text-xxs uppercase text-slate-400 font-semibold block font-sans">Especialidades</span>
                <span className="text-xxs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                  Ciencias Básicas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Log Session Form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="form-log-session">
          <h4 className="font-bold text-slate-800 text-sm mb-3.5 flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-amber-500" />
            Acreditar Horas de Tutoría (Célula REDSAB)
          </h4>

          <form onSubmit={handleSubmitSession} className="space-y-3.5">
            <div>
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Alumno Beneficiario (Mentee)</label>
              <select
                id="session-mentee-select"
                value={selectedMenteeId}
                onChange={(e) => setSelectedMenteeId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
              >
                <option value="all">Soporte Multigrupal (Todos)</option>
                {assignedMentees.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Curso dictado</label>
                <select
                  id="session-course-select"
                  value={sessionCourse}
                  onChange={(e) => setSessionCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-amber-500"
                >
                  {allCourses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Horas dedicadas</label>
                <input
                  id="session-hours-input"
                  type="number"
                  min="1"
                  max="10"
                  value={sessionHours}
                  onChange={(e) => setSessionHours(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xxs font-bold text-slate-400 uppercase tracking-wider block mb-1">Evidencia / Temas Abordados</label>
              <textarea
                id="session-summary-text"
                rows={3}
                placeholder="Ej. Explicamos resolución de derivadas complicadas previas a la Práctica de Cálculo..."
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <button
              id="btn-log-session"
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 text-xs transition-colors font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="h-4 w-4" /> Registrar sesión para Acreditación
            </button>
          </form>

          {showLogFeedback && (
            <div className="mt-3 text-xxs font-medium text-emerald-800 bg-emerald-50 rounded-lg p-2.5 border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> ¡Sesión registrada y enviada a la Oficina de Bienestar para validar!
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Assigned Mentees details, early alerts, and checklists */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Tutor Group Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="study-group">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Mi Célula de Acompañamiento REDSAB
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Control de promedio, sintonía psicoemocional y alertas predictivas de tus becarios asignados</p>
            </div>
            <span className="text-xxs font-semibold bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 font-mono">
              Proporción actual: 1:{assignedMentees.length}
            </span>
          </div>

          <div className="space-y-4">
            {assignedMentees.length > 0 ? (
              assignedMentees.map(mentee => {
                // Course problems
                const coursesInTrouble = Object.keys(mentee.grades).filter(courseId => {
                  const grades = mentee.grades[courseId] || [];
                  if (grades.length === 0) return false;
                  return (grades.reduce((a,b)=>a+b,0) / grades.length) < 11.5;
                });

                return (
                  <div key={mentee.id} className="border border-slate-150 p-4 rounded-xl space-y-3 hover:border-amber-400 hover:bg-slate-50/10 transition-all">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center">
                          {mentee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{mentee.name}</h4>
                          <span className="text-xxs font-mono text-slate-400 bg-slate-50 px-1 rounded block">{mentee.carrera}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <span className="text-xxs text-slate-400 block font-sans">Promedio Total</span>
                          <span className={`text-xs font-bold font-mono ${
                            mentee.promedio >= 14 ? 'text-emerald-600' : mentee.promedio >= 11.5 ? 'text-amber-500' : 'text-rose-600'
                          }`}>
                            {mentee.promedio.toFixed(1)}
                          </span>
                        </div>
                        {/* Traffic light alert indicator */}
                        <div className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono tracking-wide ${
                          mentee.promedio >= 14 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          mentee.promedio >= 11.5 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                        } border`}>
                          {mentee.promedio >= 14 ? 'BIEN' : mentee.promedio >= 11.5 ? 'PRECAUCIÓN' : '🆘 CRÍTICO'}
                        </div>
                      </div>
                    </div>

                    {/* Tutor detailed checklists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xxs">
                      <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-600 block uppercase font-mono text-[9px] tracking-wider">Cursos de Riesgo:</span>
                        {coursesInTrouble.length > 0 ? (
                          <div className="space-y-1">
                            {coursesInTrouble.map(cId => {
                              const courseObj = allCourses.find(c => c.id === cId);
                              const gList = mentee.grades[cId] || [];
                              const avg = Number((gList.reduce((a,b)=>a+b,0)/gList.length).toFixed(1));
                              return (
                                <span key={cId} className="flex justify-between items-center bg-rose-50/60 text-rose-800 px-2 py-1 rounded border border-rose-100 italic">
                                  <span>{courseObj?.name || cId}</span>
                                  <span className="font-mono font-bold">Promedio: {avg}</span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block font-sans font-medium">Ningún curso desaprobado</span>
                        )}
                      </div>

                      <div className="space-y-2.5 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-600 block uppercase font-mono text-[9px] tracking-wider">Plan de Nivelación Recomendado:</span>
                        <div className="flex flex-wrap gap-2">
                          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                            <input type="checkbox" defaultChecked={mentee.promedio >= 11.5} className="rounded text-amber-500 accent-amber-500 focus:ring-0" />
                            <span>Repaso de Algebra / Cálculo I</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                            <input type="checkbox" defaultChecked={mentee.streak >= 4} className="rounded text-amber-500 accent-amber-500 focus:ring-0" />
                            <span>Ver cápsula semanal indispensable</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                            <input type="checkbox" defaultChecked={mentee.carrera.includes('Ingeniería')} className="rounded text-amber-500 accent-amber-500 focus:ring-0" />
                            <span>Familiarización de Préstamos Casio</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-500 font-mono">Único check-in registrado: <strong>Estable</strong></span>
                      <button className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5 stroke-[2.5]" />
                        Enviar Ánimo Semanal
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 bg-slate-50 border border-dashed rounded-xl">
                <Users className="h-5 w-5 text-slate-400 mx-auto" />
                <p className="text-xxs text-slate-500 mt-2">No tienes ningún becario de primer ciclo asignado a tu guardia en este momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Volunteering Certification Advice card */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-amber-600" />
            Certificado de Voluntariado UDEP
          </h4>
          <p className="text-xxs text-slate-600 leading-relaxed mt-1">
            Al finalizar las 60 horas registradas y validadas por Bienestar, se convalidará tu servicio en el programa de becas oficiales REDSAB de la Dirección de Estudios. Tu apoyo directo rompe las asimetrías de base escolar para los becarios de primeros ciclos. ¡Gracias por tu enorme capital social!
          </p>
        </div>

      </div>

    </div>
  );
}
