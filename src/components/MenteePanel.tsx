import React, { useState } from 'react';
import { Student, Course, LessonCapsule, LoanItem, AcademicRisk, LoanRequest } from '../types';
import { GraduationCap, Award, BookOpen, Calculator, Play, CheckCircle, AlertTriangle, HelpCircle, Sparkles, Plus, Send } from 'lucide-react';

interface MenteePanelProps {
  student: Student;
  allCourses: Course[];
  allCapsules: LessonCapsule[];
  allLoanItems: LoanItem[];
  allMentors: any[];
  onAddGrade: (studentId: string, courseId: string, grade: number) => void;
  onRequestLoan: (studentId: string, itemId: string) => void;
  activeLoans: LoanRequest[];
  onAddEcopuntos: (studentId: string, amount: number) => void;
  onIncreaseStreak: (studentId: string) => void;
}

export default function MenteePanel({
  student,
  allCourses,
  allCapsules,
  allLoanItems,
  allMentors,
  onAddGrade,
  onRequestLoan,
  activeLoans,
  onAddEcopuntos,
  onIncreaseStreak
}: MenteePanelProps) {
  // Local state for grade insertion
  const [selectedCourseId, setSelectedCourseId] = useState<string>(allCourses[0]?.id || '');
  const [newGradeValue, setNewGradeValue] = useState<number | ''>('');
  
  // Local state for active micro-capsule quiz
  const [activeCapsuleId, setActiveCapsuleId] = useState<string | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);

  // Local state for emotional check-in confirmation message
  const [moodStatus, setMoodStatus] = useState<string>('Estable');
  const [showMoodFeedback, setShowMoodFeedback] = useState<boolean>(false);

  // Find mentor
  const assignedMentor = allMentors.find(m => m.id === student.mentorId);

  // Grade action handler
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGradeValue === '' || newGradeValue < 0 || newGradeValue > 20) return;
    onAddGrade(student.id, selectedCourseId, Number(newGradeValue));
    setNewGradeValue('');
  };

  // Quiz submission helper
  const handleQuizSubmit = (capsule: LessonCapsule) => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === capsule.quiz.correctIndex) {
      setQuizResult('correct');
      onAddEcopuntos(student.id, 50);
      onIncreaseStreak(student.id);
    } else {
      setQuizResult('incorrect');
    }
  };

  const startQuiz = (capsuleId: string) => {
    setActiveCapsuleId(capsuleId);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  // Mood button click
  const handleMoodCheck = (mood: string) => {
    setMoodStatus(mood);
    setShowMoodFeedback(true);
    setTimeout(() => setShowMoodFeedback(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6" id="mentee-panel">
      {/* LEFT COLUMN: Student Profile, Emotional Check, and Semaforo Alerts */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden" id="mentee-profile">
          <div className="absolute top-0 right-0 w-24 h-24 bg-udep-blue-light/5 rounded-full -translate-y-6 translate-x-6"></div>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-udep-blue-light text-white font-bold text-center flex items-center justify-center text-lg shadow-md">
              {student.name.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">{student.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{student.carrera}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xxs uppercase text-slate-400 font-semibold block">Promedio</span>
              <span className={`text-base font-extrabold font-mono ${
                student.promedio >= 14 ? 'text-emerald-600' : student.promedio >= 11.5 ? 'text-amber-500' : 'text-rose-600'
              }`}>
                {student.promedio.toFixed(1)}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xxs uppercase text-slate-400 font-semibold block">Ecopuntos</span>
              <span className="text-base font-extrabold text-amber-500 font-mono flex items-center justify-center gap-0.5">
                <Sparkles className="h-4 w-4 fill-amber-300 stroke-amber-500" />
                {student.ecopuntos}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-xxs uppercase text-slate-400 font-semibold block font-sans">Racha (Días)</span>
              <span className="text-base font-extrabold text-emerald-600 font-mono">
                🔥 {student.streak}
              </span>
            </div>
          </div>

          {/* Semaforo status banner */}
          <div className={`mt-4 p-3.5 rounded-xl border flex items-center gap-3 ${
            student.risk === AcademicRisk.Low 
              ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
              : student.risk === AcademicRisk.Medium 
                ? 'bg-amber-50 border-amber-150 text-amber-800' 
                : 'bg-rose-50 border-rose-150 text-rose-800'
          }`}>
            <span className="flex-shrink-0 animate-pulse relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                student.risk === AcademicRisk.Low ? 'bg-emerald-400' : student.risk === AcademicRisk.Medium ? 'bg-amber-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                student.risk === AcademicRisk.Low ? 'bg-emerald-500' : student.risk === AcademicRisk.Medium ? 'bg-amber-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider text-xxs block">Estado del Semáforo REDSAB</span>
              {student.risk === AcademicRisk.Low && "Rendimiento óptimo. Sigue cumpliendo tus responsabilidades."}
              {student.risk === AcademicRisk.Medium && "Alerta intermedia. Te sugerimos repasar cápsulas complejas."}
              {student.risk === AcademicRisk.High && "En Riesgo Crítico. Se ha enviado una ALERTA TEMPRANA de auxilio académico a Bienestar."}
            </div>
          </div>
        </div>

        {/* Grades Ledger & Insertion Form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="live-grades">
          <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-udep-blue-light" />
            Monitoreo Clínico de Notas (Cursos Básicos)
          </h4>
          
          <div className="space-y-3 mb-4">
            {allCourses.map(course => {
              const courseGrades = student.grades[course.id] || [];
              const courseAverage = courseGrades.length > 0 
                ? Number((courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length).toFixed(1))
                : null;
              
              return (
                <div key={course.id} className="flex justify-between items-center text-xs p-2 bg-slate-50/50 rounded-lg hover:bg-slate-50 border border-slate-100 transition-all">
                  <div>
                    <span className="font-bold text-slate-700 block">{course.name}</span>
                    <span className="text-xxs font-mono text-slate-400">{course.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 max-w-[120px] overflow-hidden">
                      {courseGrades.map((g, idx) => (
                        <span key={idx} className={`font-mono font-semibold px-1 rounded ${
                          g >= 11 ? 'bg-slate-100 text-slate-700' : 'bg-red-50 text-red-600'
                        }`}>{g}</span>
                      ))}
                    </div>
                    {courseAverage !== null ? (
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        courseAverage >= 14 ? 'bg-emerald-100 text-emerald-800' : courseAverage >= 11.5 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {courseAverage}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xxs font-sans italic">Sin notas</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleGradeSubmit} className="border-t border-slate-100 pt-3.5 space-y-3">
            <span className="text-xxs font-bold uppercase text-slate-400 tracking-wider block">Registrar Calificación Parcial (Simulador)</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                id="grade-course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-udep-blue-light"
              >
                {allCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                id="grade-value-input"
                type="number"
                min="0"
                max="20"
                placeholder="Nota (0-20)"
                value={newGradeValue}
                onChange={(e) => setNewGradeValue(e.target.value === '' ? '' : Math.min(20, Math.max(0, Number(e.target.value))))}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-udep-blue-light font-mono"
              />
            </div>
            <button
              id="btn-add-grade"
              type="submit"
              className="w-full bg-udep-blue-light hover:bg-udep-blue-dark text-white rounded-xl py-1.5 text-xs transition-colors font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="h-4 w-4" /> Guardar Calificación
            </button>
          </form>
        </div>

        {/* Hermano Mayor (Support Card) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="hermano-mayor-card">
          <span className="bg-udep-yellow/10 text-udep-blue-dark font-sans font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            🤝 Soporte Psicosocial Horizontal
          </span>
          {assignedMentor ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow">
                  {assignedMentor.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{assignedMentor.name}</h5>
                  <p className="text-xxs text-slate-400 font-sans">Hermano Mayor ({assignedMentor.carrera}, Ciclo {assignedMentor.ciclo})</p>
                </div>
              </div>
              <div className="text-xxs text-slate-500">
                <span className="font-semibold text-slate-600">Especialidades: </span>
                {assignedMentor.especialidades.join(', ')}
              </div>

              {/* Emotional Wellness check-in buttons */}
              <div className="border-t border-slate-150 pt-3">
                <span className="text-xxs font-bold text-slate-400 block mb-2 font-mono">¿CÓMO VA TU BIENESTAR HOY? (Check-in rápido)</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { text: 'Estudiando seguro 😎', state: 'Seguro' },
                    { text: 'Un poco saturado/a 😵‍💫', state: 'Saturado' },
                    { text: 'Necesito tutoría urgente! 🆘', state: 'Necesito Auxilio' }
                  ].map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMoodCheck(mood.state)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-medium cursor-pointer transition-colors ${
                        moodStatus === mood.state 
                          ? 'bg-udep-blue-dark text-white border-udep-blue-dark shadow-sm' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {mood.text}
                    </button>
                  ))}
                </div>
                {showMoodFeedback && (
                  <div className="mt-3 text-xxs font-medium text-emerald-700 bg-emerald-50 rounded-lg p-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Sentimiento enviado a {assignedMentor.name} y Bienestar para contención.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <HelpCircle className="h-6 w-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500 font-medium">Buscando Hermano Mayor ideal...</p>
              <p className="text-xxs text-slate-400 mt-1 max-w-[200px] mx-auto">La Oficina de Bienestar puede utilizar el motor de matching automatizado para asignarte un mentor.</p>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Micro-Capsules Deck and Logistics Hub Loans */}
      <div className="lg:col-span-8 space-y-6">

        {/* Micro-Capsule Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="capsules-section">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-udep-blue-light" />
                C3: Micro-Cápsulas de Co-Aprendizaje
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Videos y resúmenes menores a 5 min optimizados para conectividades asimétricas</p>
            </div>
            <span className="text-xxs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border">Cápsulas: 4/60</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCapsules.map(capsule => {
              const isCurrentQuizActive = activeCapsuleId === capsule.id;
              
              return (
                <div key={capsule.id} className="border border-slate-150 rounded-xl hover:border-slate-300 overflow-hidden flex flex-col justify-between bg-slate-50/20 hover:bg-white transition-all">
                  
                  {/* Thumbnail Mockup */}
                  <div className="relative h-28 w-full bg-slate-700 overflow-hidden">
                    <img 
                      src={capsule.videoUrlMock} 
                      alt={capsule.title} 
                      className="object-cover w-full h-full opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <span className="absolute bottom-2.5 right-2.5 font-mono text-xxs font-semibold bg-slate-900/80 text-white px-2 py-0.5 rounded">
                      ⏱️ {capsule.duration} min
                    </span>
                    <span className="absolute top-2.5 left-2.5 font-mono text-[9px] font-extrabold bg-udep-yellow text-udep-blue-dark px-2 py-0.5 rounded shadow">
                      {capsule.courseName}
                    </span>
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => startQuiz(capsule.id)}
                        className="p-2.5 rounded-full bg-udep-blue-light/95 hover:bg-udep-blue-dark hover:scale-105 active:scale-95 text-white shadow-lg transition-all"
                      >
                        <Play className="h-5 w-5 fill-white" />
                      </button>
                    </div>
                  </div>

                  {/* Info text */}
                  <div className="p-3.5 flex-grow">
                    <h5 className="font-bold text-slate-800 text-xs leading-snug line-clamp-1">{capsule.title}</h5>
                    <p className="text-xxs text-slate-500 mt-1 line-clamp-2">{capsule.description}</p>
                    <div className="flex items-center justify-between mt-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        capsule.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        capsule.difficulty === 'Media' ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'bg-red-50 text-red-650'
                      }`}>Dificultad: {capsule.difficulty}</span>
                      
                      <button
                        onClick={() => startQuiz(capsule.id)}
                        className="text-xxs text-udep-blue-light font-bold hover:underline flex items-center gap-1"
                      >
                        Ver Reto +50 pts
                      </button>
                    </div>
                  </div>

                  {/* Active Quiz Overlay */}
                  {isCurrentQuizActive && (
                    <div className="border-t border-slate-200 bg-white p-4 space-y-3">
                      <h6 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                        <HelpCircle className="h-4 w-4 text-udep-yellow-dark" />
                        Reto Rápido de Comprensión
                      </h6>
                      <p className="text-xxs text-slate-600 font-sans">{capsule.quiz.question}</p>
                      
                      <div className="space-y-1.5">
                        {capsule.quiz.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedQuizAnswer(oIdx)}
                            className={`w-full text-left p-2 rounded-xl text-xxs transition-colors border block ${
                              quizSubmitted 
                                ? oIdx === capsule.quiz.correctIndex 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' 
                                  : selectedQuizAnswer === oIdx 
                                    ? 'bg-rose-50 border-rose-300 text-rose-850' 
                                    : 'bg-white border-slate-100 text-slate-400'
                                : selectedQuizAnswer === oIdx
                                  ? 'bg-udep-blue-light/5 border-udep-blue-light text-udep-blue-dark font-medium'
                                  : 'bg-white hover:bg-slate-50 border-slate-150 text-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => setActiveCapsuleId(null)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xxs font-bold"
                          >
                            Cerrar
                          </button>
                          <button
                            disabled={selectedQuizAnswer === null}
                            onClick={() => handleQuizSubmit(capsule)}
                            className="px-4 py-1.5 bg-udep-blue-light disabled:bg-slate-200 hover:bg-udep-blue-dark text-white rounded-lg text-xxs font-bold shadow"
                          >
                            Postular Respuesta
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          {quizResult === 'correct' ? (
                            <div className="text-xxs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                              <Sparkles className="h-4.5 w-4.5 text-udep-yellow fill-emerald-300 animate-bounce" />
                              <span>¡Exacto! Sumaste +50 Ecopuntos y extendiste tu racha a 🔥 {student.streak + 1}</span>
                            </div>
                          ) : (
                            <div className="text-xxs font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                              ❌ Respuesta incorrecta. Vuelve a analizar la cápsula.
                            </div>
                          )}
                          <p className="text-xxs text-slate-550 leading-relaxed bg-slate-100/60 p-2.5 rounded hover:bg-slate-100">
                            <strong>Explicación:</strong> {capsule.quiz.explanation}
                          </p>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                setActiveCapsuleId(null);
                                setQuizSubmitted(false);
                                setQuizResult(null);
                              }}
                              className="px-4.5 py-1.5 bg-slate-800 text-white rounded-lg text-xxs font-bold hover:bg-slate-900"
                            >
                              Finalizar Cápsula
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Hub Logístico: Préstamos interactivos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200" id="logistics-loans">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-udep-blue-light" />
                C3: Hub Logístico de Recursos Compartidos
              </h3>
              <p className="text-xxs text-slate-400 font-sans mt-0.5">Reserva hardware científico y libros especializados de alta demanda (Gamificación UDEP)</p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-udep-blue-dark border border-amber-500/20">
              Uso de Ecopuntos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {allLoanItems.map(item => {
              const hasEcopuntos = student.ecopuntos >= item.ecopuntosCost;
              return (
                <div key={item.id} className="border border-slate-150 p-3.5 rounded-xl flex items-start gap-3 bg-slate-50/30 hover:bg-white hover:border-slate-300 transition-all">
                  <div className="p-2.5 bg-slate-200/50 rounded-lg text-slate-600 mt-1">
                    {item.type === 'Calculadora' ? <Calculator className="h-5.5 w-5.5" /> : <BookOpen className="h-5.5 w-5.5" />}
                  </div>
                  <div className="flex-grow space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">{item.type}</span>
                    <h5 className="font-bold text-slate-800 text-xs leading-none">{item.name}</h5>
                    <p className="text-xxs text-slate-500 font-mono">ID/Code: {item.serialOrTitle}</p>
                    
                    <div className="flex items-center gap-2 pt-1 font-mono">
                      <span className={`text-xxs ${item.availableStock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500'}`}>
                        En Stock: {item.availableStock} / {item.totalStock}
                      </span>
                      <span>•</span>
                      <span className="text-xxs text-slate-500">Costo: {item.ecopuntosCost} pts</span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onRequestLoan(student.id, item.id)}
                        disabled={item.availableStock === 0 || !hasEcopuntos}
                        className={`px-3 py-1.5 rounded-xl text-xxs font-bold shadow-sm transition-all flex items-center justify-center gap-1 ${
                          item.availableStock > 0 && hasEcopuntos
                            ? 'bg-udep-blue-light hover:bg-udep-blue-dark text-white'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border'
                        }`}
                      >
                        {item.availableStock === 0 ? 'Agotado' : !hasEcopuntos ? 'Insuficientes Puntos' : 'Solicitar Préstamo'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Loans scheduling log */}
          <div className="border-t border-slate-150 pt-4">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 font-mono">Mis Préstamos Activos y Devoluciones</h4>
            <div className="space-y-2">
              {activeLoans.filter(l => l.studentId === student.id).length > 0 ? (
                activeLoans.filter(l => l.studentId === student.id).map(loan => (
                  <div key={loan.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500">
                        {loan.itemType === 'Calculadora' ? <Calculator className="h-4.5 w-4.5" /> : <BookOpen className="h-4.5 w-4.5" />}
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block text-xs">{loan.itemName}</span>
                        <span className="text-xxs font-mono text-slate-400">Entrega: {loan.requestDate} • Límite Devolución: <strong className="text-rose-500">{loan.dueDate}</strong></span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xxs font-bold rounded-lg font-mono ${
                      loan.status === 'Devuelto' ? 'bg-emerald-150 text-emerald-800' :
                      loan.status === 'Retrasado' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {loan.status === 'Devuelto' ? 'Devuelto' : loan.status === 'Retrasado' ? '⚠️ RETRASADO (-5 pts/día)' : 'En Préstamo'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xxs italic">No tienes ningún material o hardware en préstamo actualmente.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
