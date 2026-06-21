import React, { useState } from 'react';
import { Student, Mentor, AcademicAlert, LoanItem, LoanRequest, AcademicRisk } from '../types';
import { ShieldAlert, Users, Calculator, RefreshCw, CheckCircle, Clock, Trash2, Plus, AlertCircle, HelpCircle, UserCheck } from 'lucide-react';

interface BienestarPanelProps {
  students: Student[];
  mentors: Mentor[];
  alerts: AcademicAlert[];
  loanItems: LoanItem[];
  loanRequests: LoanRequest[];
  onAttendAlert: (alertId: string, notes: string) => void;
  onExecuteMatching: () => void;
  onReplenishStock: (itemId: string, count: number) => void;
  onReturnLoan: (loanId: string) => void;
}

export default function BienestarPanel({
  students,
  mentors,
  alerts,
  loanItems,
  loanRequests,
  onAttendAlert,
  onExecuteMatching,
  onReplenishStock,
  onReturnLoan
}: BienestarPanelProps) {
  // Local state for alert attendance
  const [attendingAlertId, setAttendingAlertId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  // Unassigned Mentees & Available Mentors list
  const unassignedMentees = students.filter(m => !m.mentorId);
  const availableMentors = mentors.filter(m => m.menteeIds.length < m.maxMentees);

  // Stats calculation
  const totalStudents = students.length;
  const highRiskCount = students.filter(s => s.risk === AcademicRisk.High).length;
  const mediumRiskCount = students.filter(s => s.risk === AcademicRisk.Medium).length;
  const lowRiskCount = students.filter(s => s.risk === AcademicRisk.Low).length;
  
  const scholarshipRetentionPercent = 98.3; // Static or semi-dynamic KPI

  const handleResolveAlert = (id: string) => {
    if (!resolutionNotes.trim()) return;
    onAttendAlert(id, resolutionNotes);
    setAttendingAlertId(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 p-4 md:p-6" id="bienestar-panel">
      
      {/* 1. WELFARE MANAGEMENT KPI BANNER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Tasa Retención Becas</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-xl font-extrabold text-emerald-600 font-mono">{scholarshipRetentionPercent}%</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-sans">Meta: &gt;98%</span>
          </div>
          <span className="text-xxs text-slate-500 mt-1 block">Condición regular garantizada</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Alertas Críticas Activas</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-xl font-extrabold text-rose-600 font-mono">
              {alerts.filter(a => a.status === 'Pendiente').length} casos
            </span>
            <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-sans">Semaforización</span>
          </div>
          <span className="text-xxs text-slate-500 mt-1 block">Requiere atención en &lt; 24h</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Ecosistema Tutores</span>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-xl font-extrabold text-slate-800 font-mono">
              {mentors.length} Activos
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">1:4 Ratio</span>
          </div>
          <span className="text-xxs text-slate-500 mt-1 block">Alumnos del ciclo superior</span>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono text-slate-500">Distribución de Alertas</span>
          <div className="flex gap-2.5 mt-2">
            <span className="text-xxs font-mono font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
              🟢 {lowRiskCount}
            </span>
            <span className="text-xxs font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1 font-sans">
              🟡 {mediumRiskCount}
            </span>
            <span className="text-xxs font-mono font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
              🔴 {highRiskCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ALERTS AND MATCHING REGION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alerts queue ("Caso Rojo" addressed in < 24h) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="alerts-queue">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600 animate-pulse" />
                Semaforización Predictiva: Cola de Alertas Tempranas
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Alertas automáticas detonadas cuando el promedio parcial cae por debajo de 11.5 (Rigidez Normativa)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-50 border border-rose-100 text-rose-800 font-bold">
              Meta: Resoluciones &lt; 24h
            </span>
          </div>

          <div className="space-y-3.5">
            {alerts.length > 0 ? (
              alerts.map(alert => {
                const isUnderAttendance = attendingAlertId === alert.id;
                return (
                  <div key={alert.id} className={`border p-3.5 rounded-xl space-y-3 transition-colors ${
                    alert.status === 'Atendido' 
                      ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80' 
                      : 'bg-rose-50/40 border-rose-150 text-slate-800 shadow-sm'
                  }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-850 text-xs">{alert.studentName}</span>
                          <span className="text-xxs px-2 py-0.5 bg-slate-200/60 rounded font-semibold text-slate-600">{alert.studentCarrera}</span>
                        </div>
                        <p className="text-xxs text-slate-450 mt-1">
                          Asignatura: <strong className="text-slate-700">{alert.courseName}</strong> • Promedio Parcial: <strong className="text-rose-600 font-mono">{alert.average.toFixed(1)}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] font-mono block text-slate-400">{alert.timestamp}</span>
                        <div className="flex justify-end gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 text-xxs font-extrabold rounded-lg inline-block font-sans ${
                            alert.status === 'Atendido' 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-150' 
                              : 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                          } border`}>
                            {alert.status === 'Atendido' ? 'Atendido en < 24h' : '🚨 Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {alert.notes && (
                      <div className="text-xxs p-2 bg-white rounded border border-slate-150 text-slate-600 italic">
                        <strong>Acción Ejecutada:</strong> {alert.notes} {alert.atendidoAt && `(${alert.atendidoAt})`}
                      </div>
                    )}

                    {alert.status === 'Pendiente' && !isUnderAttendance && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setAttendingAlertId(alert.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xxs px-3 py-1.5 rounded-lg transition-all shadow flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" /> Ejecutar Contención Académica
                        </button>
                      </div>
                    )}

                    {isUnderAttendance && (
                      <div className="bg-white p-3 rounded-lg border border-rose-200 space-y-2.5">
                        <label className="text-xxs font-bold text-slate-500 uppercase tracking-wider block">Registrar Bitácora de Bienestar (Contención)</label>
                        <textarea
                          id="resolution-notes-text"
                          rows={2}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Ej. Citado con tutor de guardia. Se le asignó calculadora Casio de respaldo y refuerzo en Cálculo I los sábados..."
                          className="w-full bg-slate-50 border border-slate-200 p-2 text-xs rounded-xl outline-none focus:border-rose-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setAttendingAlertId(null)}
                            className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xxs font-medium"
                          >
                            Cancelar
                          </button>
                          <button
                            hidden={!resolutionNotes.trim()}
                            onClick={() => handleResolveAlert(alert.id)}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xxs font-bold shadow"
                          >
                            Consolidar Resolución &lt; 24h
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-slate-50 border rounded-xl">
                <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                <p className="text-xxs text-slate-500 font-bold mt-2">¡Semaforización Limpia! Cero alertas críticas.</p>
                <p className="text-xxs text-slate-400 mt-1">Los promedios parciales de los becarios están por encima del rango de deserción.</p>
              </div>
            )}
          </div>
        </div>

        {/* Matching algorithm simulator */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="matching-engine">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-udep-blue-light" />
                C2: Algoritmo Inteligente de Acoplamiento (Matching 1:4)
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Emparejamiento automatizado basado en afinidad de carrera, especialidad, y carga crediticia</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 bg-sky-50 border border-sky-100 text-sky-800 font-bold">
              Voluntarios Libres
            </span>
          </div>

          <div className="space-y-4">
            {/* Visual breakdown showing who is currently paired */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                <span className="text-xxs font-bold text-slate-400 block font-mono">ESTUDIANTES HUÉRFANOS</span>
                <div className="mt-2 space-y-1">
                  {unassignedMentees.length > 0 ? (
                    unassignedMentees.map(m => (
                      <span key={m.id} className="text-xxs font-semibold bg-rose-50 text-rose-700 px-2 py-1 rounded block border border-rose-100">
                        🚨 {m.name} ({m.carrera.substring(0, 15)}...)
                      </span>
                    ))
                  ) : (
                    <span className="text-xxs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded block border border-emerald-100">✅ 100% Emparejados</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                <span className="text-xxs font-bold text-slate-400 block font-mono">ALUMNOS MENTORES CON CAPACIDAD</span>
                <div className="mt-2 space-y-1">
                  {availableMentors.length > 0 ? (
                    availableMentors.map(m => {
                      const capacityLeft = m.maxMentees - m.menteeIds.length;
                      return (
                        <span key={m.id} className="text-xxs font-semibold bg-sky-50 text-sky-700 px-2 py-1 rounded block border border-sky-100 font-mono">
                          💪 {m.name} (Espacios: {capacityLeft}/4)
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xxs text-slate-400 italic font-sans block">Mentores con capacidad tope</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xxs text-slate-500 leading-relaxed max-w-sm font-sans">
                La regla lógica del algoritmo <strong>Matching 1:4</strong> evalúa los colegios de origen asimétricos, asignaturas críticas en común, compatibilidad de horarios y carrera para optimizar el soporte socioemocional sin saturar el sistema.
              </p>
              
              <button
                id="btn-run-matching"
                disabled={unassignedMentees.length === 0 || availableMentors.length === 0}
                onClick={onExecuteMatching}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  unassignedMentees.length > 0 && availableMentors.length > 0
                    ? 'bg-udep-blue-light text-white hover:bg-udep-blue-dark hover:scale-103'
                    : 'bg-slate-100 text-slate-400 border cursor-not-allowed'
                }`}
              >
                <UserCheck className="h-4.5 w-4.5" />
                Ejecutar Algoritmo Matching
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. LOGISTIC RESOURCE HUB CONTROL Panel */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="audit-logistics">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Calculator className="h-5 w-5 text-udep-blue-light" />
              C3: Hub Logístico: Auditoría y Stock General
            </h3>
            <p className="text-xxs text-slate-400 font-sans mt-0.5">Control centralizado de préstamos de calculadoras científicas Casio fx-99LAX y libros de texto guía (SOPORTE DE HARDWARE)</p>
          </div>
          <span className="text-xxs font-mono text-slate-400 bg-slate-50 border px-2 py-1 rounded">Auditoría: 100% Regular</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List items with replenishment tools */}
          <div className="md:col-span-1 space-y-3.5">
            <span className="text-xxs font-bold text-slate-400 block font-mono">RESTABLECER INVENTARIO FÍSICO</span>
            {loanItems.map(item => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 block line-clamp-1">{item.name}</span>
                </div>
                <div className="flex justify-between items-center text-xxs font-mono text-slate-500 pt-1">
                  <span>Stock: <strong>{item.availableStock}/{item.totalStock}</strong></span>
                  <button
                    onClick={() => onReplenishStock(item.id, 1)}
                    className="text-udep-blue-light border border-udep-blue-light hover:bg-udep-blue-light/5 text-xxs px-2 py-0.5 font-bold rounded"
                  >
                    +1 Unidad
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Loans list with option to Return */}
          <div className="md:col-span-2 space-y-3.5">
            <span className="text-xxs font-bold text-slate-400 block font-mono">HILERA DE PRÉSTAMOS LOGÍSTICOS EN CURSO</span>
            <div className="space-y-2.5">
              {loanRequests.length > 0 ? (
                loanRequests.map(loan => (
                  <div key={loan.id} className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs leading-tight">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{loan.itemName}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          loan.itemType === 'Calculadora' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>{loan.itemType}</span>
                      </div>
                      <p className="text-xxs text-slate-500 font-mono">
                        Solicitante: <strong className="text-slate-700">{loan.studentName}</strong> • Plazo Máximo: <strong className="text-rose-500">{loan.dueDate}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-xxs font-bold rounded ${
                        loan.status === 'Devuelto' ? 'bg-slate-200 text-slate-600' : 
                        loan.status === 'Retrasado' ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {loan.status === 'Devuelto' ? 'Terminado' : loan.status === 'Retrasado' ? 'Retrasado' : 'Prestado'}
                      </span>
                      {loan.status !== 'Devuelto' && (
                        <button
                          onClick={() => onReturnLoan(loan.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xxs font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                        >
                          Marcar Devolución
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xxs italic">No hay historial ni préstamos logísticos cargados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
