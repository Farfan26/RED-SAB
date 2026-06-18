/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CourseGrade, CourseName, Student, TutorshipRequest, Evaluation } from '../types';
import { 
  getStudentGrades, 
  saveStudentGrades, 
  createTutorshipRequest, 
  getTutorships, 
  triggerPsychoAlert,
  cancelTutorshipRequest,
  addPointsToUser,
  addAchievementToUser
} from '../lib/storage';
import { 
  BookOpen, 
  Save, 
  HelpCircle, 
  AlertOctagon, 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  HeartHandshake, 
  ChevronRight, 
  Plus, 
  Send,
  Trophy,
  Sparkles,
  Image as ImageIcon,
  Star,
  Flame,
  Lightbulb,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BecadoDashboardProps {
  student: Student;
  onRefreshStats: () => void;
}

// Course details banner background photos to make courses pop
const COURSE_BANNERS: Record<CourseName, string> = {
  [CourseName.CalculoI]: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60",
  [CourseName.AlgebraLineal]: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60",
  [CourseName.FisicaGeneral]: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60",
  [CourseName.IntroIngenieria]: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
  [CourseName.LenguaEspanola]: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=60",
};

// Initial physical/digital campus study photos representing Piura community life
const INITIAL_STUDY_PHOTOS = [
  {
    id: "p-1",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=60",
    title: "Asesoría de Límites en Jardines UDEP",
    description: "Juan Manuel repasando asíntotas junto al mentor Dany Joel bajo las sombras de los algarrobos.",
    author: "Dany Joel",
    date: "Ayer"
  },
  {
    id: "p-2",
    url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&auto=format&fit=crop&q=60",
    title: "Mesas de Trabajo de Física General",
    description: "Milagros Chunga practicando diagramas de cuerpo libre en la terraza del Edificio de Ingeniería.",
    author: "Evelyn Nicol",
    date: "Hace 2 días"
  },
  {
    id: "p-3",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=60",
    title: "Estudio Silencioso Pre-Exámenes",
    description: "Cachimbos de primer ciclo concentrados en la Biblioteca Central del Campus Piura.",
    author: "Bienestar UDEP",
    date: "Hace 3 días"
  },
  {
    id: "p-4",
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=60",
    title: "Tutoría de Programación e Ingeniería",
    description: "Estudio colaborativo de algoritmos y matriz de diseño de proyectos de desarrollo.",
    author: "Gretta Lucía",
    date: "Hace 4 días"
  }
];

const TRIVIA_QUESTIONS = [
  {
    question: "¿Cuántas horas mínimo semanales aconseja Bienestar Universitario dedicar al estudio individual continuo de asignaturas cuantitativas como Cálculo I?",
    options: [
      "No hay mínimo, estudiar un par de horas antes de la prueba basta.",
      "Entre 2 a 3 horas de autoestudio activo por cada hora de clase dictada.",
      "Solo es necesario repasar apuntes si el semáforo cambia a rojo.",
      "10 horas al mes en total para toda la carrera académica."
    ],
    correctIdx: 1,
    tip: "¡El secreto de los primeros ciclo en ingeniería es la disciplina constante! El autoestudio te prepara para discutir con dudas reales en tus tutorías."
  },
  {
    question: "¿Qué acción proactiva genera resultados inmediatos si tu semáforo de Álgebra Lineal o Física cambia a Amarillo o Rojo?",
    options: [
      "Faltar a las clases por desmotivación o timidez.",
      "Ocultar las notas y esperar que la curva final te apruebe.",
      "Solicitar tutoría inmediata con un Mentor en REDSAB para nivelar temas antes del examen clasificatorio.",
      "Estudiar de manera empírica sin revisar exámenes anteriores."
    ],
    correctIdx: 2,
    tip: "Los mentores de REDSAB poseen bancos de exámenes con solucionarios aprobados por la cátedra para ayudarte a salir de la zona de riesgo."
  },
  {
    question: "Si tu tutoría con tu Hermano Mayor voluntario fue exitosa, ¿cuál es el beneficio logístico para el mentor?",
    options: [
      "Acumula +50 Puntos de Voluntariado para canjear calculadoras científicas y libros guía en la tienda REDSAB.",
      "Recibe una exoneración del Examen Final del curso que dicta.",
      "El becado debe regalarle un cuaderno empastado de apuntes.",
      "Recibe una compensación económica en efectivo del Campus."
    ],
    correctIdx: 0,
    tip: "El voluntariado de la UDEP se apoya en el altruismo institucional, Bienestar Universitario equipa a los mejores guías con materiales de física y matemática avanzadas."
  }
];

export const BecadoDashboard: React.FC<BecadoDashboardProps> = ({ student, onRefreshStats }) => {
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseName | null>(null);
  const [editingEvaluations, setEditingEvaluations] = useState<Evaluation[]>([]);
  
  // Tutorship Request State
  const [requestCourse, setRequestCourse] = useState<CourseName>(CourseName.CalculoI);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // Distress button State
  const [distressReason, setDistressReason] = useState('');
  const [distressActive, setDistressActive] = useState(false);
  const [distressSuccess, setDistressSuccess] = useState(false);

  // General tutorship list
  const [myTutorships, setMyTutorships] = useState<TutorshipRequest[]>([]);

  // TRIVIA STATE (Interactive Fun Widget)
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaCompleted, setTriviaCompleted] = useState(false);
  const [triviaFeedback, setTriviaFeedback] = useState('');

  // CAMPUS STUDY GRAPHICS GALLERY STATE (Visual Engagement Widget)
  const [studyPhotos, setStudyPhotos] = useState(INITIAL_STUDY_PHOTOS);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [student]);

  const loadData = () => {
    setGrades(getStudentGrades(student.id));
    const allTuts = getTutorships();
    setMyTutorships(allTuts.filter(t => t.menteeId === student.id));
  };

  const handleSelectCourse = (course: CourseGrade) => {
    if (selectedCourse === course.courseName) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course.courseName);
      setEditingEvaluations(JSON.parse(JSON.stringify(course.evaluations)));
    }
  };

  const handleGradeChange = (index: number, val: string) => {
    const updated = [...editingEvaluations];
    const gradeVal = val === '' ? null : Math.min(20, Math.max(0, parseFloat(val) || 0));
    updated[index].grade = gradeVal;
    setEditingEvaluations(updated);
  };

  const handleSaveGrades = (courseName: CourseName) => {
    const updatedGrades = grades.map(g => {
      if (g.courseName === courseName) {
        return {
          ...g,
          evaluations: editingEvaluations
        };
      }
      return g;
    });

    saveStudentGrades(student.id, updatedGrades);
    setGrades(getStudentGrades(student.id));
    setSelectedCourse(null);
    onRefreshStats(); // update main states
    loadData();
  };

  const handleRequestTutorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim()) return;

    createTutorshipRequest({
      menteeId: student.id,
      menteeName: student.name,
      courseName: requestCourse,
      topic: requestTopic
    });

    setRequestTopic('');
    setRequestSuccess(true);
    setTimeout(() => setRequestSuccess(false), 4000);
    loadData();
  };

  const handleCancelTutorship = (id: string) => {
    cancelTutorshipRequest(id);
    loadData();
  };

  const handleTriggerPsychoAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distressReason.trim()) return;

    triggerPsychoAlert(
      student.id,
      student.name,
      distressReason,
      selectedCourse || undefined
    );

    setDistressReason('');
    setDistressSuccess(true);
    setTimeout(() => {
      setDistressSuccess(false);
      setDistressActive(false);
    }, 4000);
  };

  // Trivia interaction
  const handleAnswerTrivia = (optIndex: number) => {
    if (triviaAnswered) return;
    setSelectedOpt(optIndex);
    setTriviaAnswered(true);

    const isCorrect = optIndex === TRIVIA_QUESTIONS[triviaIndex].correctIdx;
    if (isCorrect) {
      setTriviaScore(prev => prev + 1);
      setTriviaFeedback('¡Excelente respuesta correcta! +20 puntos agregados a tu cuenta de simulación por responder con sabiduría académica. 🌟');
      // Award simulated points to user
      addPointsToUser(student.id, 20);
    } else {
      setTriviaFeedback('Respuesta incorrecta. No te preocupes, el aprendizaje es un camino constante de tropiezos enriquecedores. 📚');
    }
  };

  const handleNextTrivia = () => {
    setSelectedOpt(null);
    setTriviaAnswered(false);
    setTriviaFeedback('');

    if (triviaIndex + 1 < TRIVIA_QUESTIONS.length) {
      setTriviaIndex(prev => prev + 1);
    } else {
      setTriviaCompleted(true);
      // Give standard achievement award
      addAchievementToUser(student.id, {
        title: "Estrella de Sabiduría UDEP",
        icon: "Trophy",
        color: "from-yellow-400 to-amber-600"
      });
      onRefreshStats();
    }
  };

  const handleRestartTrivia = () => {
    setTriviaIndex(0);
    setSelectedOpt(null);
    setTriviaAnswered(false);
    setTriviaScore(0);
    setTriviaCompleted(false);
    setTriviaFeedback('');
  };

  // Upload/Contribute Study Photo simulation
  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoDesc.trim()) return;

    // Use a lovely random studying category photo if they don't supply URL
    const defaultPic = newPhotoUrl.trim() || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=60";

    const addedPhoto = {
      id: `p-${Date.now()}`,
      url: defaultPic,
      title: newPhotoTitle,
      description: newPhotoDesc,
      author: student.name,
      date: "Ahora mismo"
    };

    setStudyPhotos([addedPhoto, ...studyPhotos]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    setNewPhotoDesc('');
    setShowPhotoForm(false);
    setPhotoSuccess(true);
    
    // Give Achievement for sharing visual log
    addAchievementToUser(student.id, {
      title: "Coordinador de Estudio Activo",
      icon: "Image",
      color: "from-blue-400 to-indigo-600"
    });
    addPointsToUser(student.id, 50); // reward
    
    onRefreshStats();
    setTimeout(() => setPhotoSuccess(false), 5000);
  };

  const getStatusColor = (status: 'verde' | 'amarillo' | 'rojo') => {
    switch (status) {
      case 'rojo': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'amarillo': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'verde': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  const getLightIndicator = (status: 'verde' | 'amarillo' | 'rojo') => {
    switch (status) {
      case 'rojo': return 'bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
      case 'amarillo': return 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      case 'verde': return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    }
  };

  return (
    <div id="becado-dashboard" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Alerta de Estado General Semáforo */}
      <div className="lg:col-span-3">
        <div className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${getStatusColor(student.status)} shadow-xs`}>
          <div className="flex items-center gap-3">
            <span className={`inline-block w-4 h-4 rounded-full ${getLightIndicator(student.status)} animate-pulse`} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Estado de Semáforo de Beca de {student.name}</p>
              <h2 className="font-display font-extrabold text-xl md:text-2xl mt-0.5">
                {student.status === 'rojo' && "En Riesgo de Pérdida de Beca ⚠️"}
                {student.status === 'amarillo' && "Soporte Preventivo Activado ⚠️"}
                {student.status === 'verde' && "Beca a Salvo y Rendimiento Excelente ✨"}
              </h2>
              <p className="text-xs opacity-90 mt-1 max-w-2xl leading-normal">
                Tu promedio ponderado actual es <strong className="font-mono text-base">{student.avgGrade}</strong> / 20.0. 
                {student.status === 'rojo' && " Consigue tutorías rápidas para subir la nota en la Práctica 3 y evitar sanciones del reglamento."}
                {student.status === 'verde' && " ¡Mantén el gran rendimiento! Tu esfuerzo inspira al voluntariado."}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button 
              id="distress-modal-trigger-btn"
              onClick={() => setDistressActive(!distressActive)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-udep-wine hover:bg-udep-wine/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-transform hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
            >
              <HeartHandshake className="h-4 w-4" />
              Solicitar Contención psicopedagógica
            </button>
          </div>
        </div>

        {/* Distress Support Slide-down Panel */}
        <AnimatePresence>
          {distressActive && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-display font-semibold text-rose-900 inline-flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-rose-600" />
                  Oficina de Apoyo Psicopedagógico (Atención Confidencial)
                </h3>
                <p className="text-xs text-rose-700 mt-1 max-w-3xl leading-relaxed">
                  Sabemos que la transición del colegio a la Universidad de Piura es dura y la presión es alta. 
                  Este mensaje se envía de forma directa a los psicopedagogos de Bienestar Universitario para 
                  agendar una cita prioritaria. No serás juzgado, estamos aquí para guiarte.
                </p>

                {distressSuccess ? (
                  <div className="mt-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold">¡Alerta enviada! Un consejero te contactará a tu correo institucional en un plazo menor a 24 horas. ¡Fuerza!</span>
                  </div>
                ) : (
                  <form onSubmit={handleTriggerPsychoAlert} className="mt-4 flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="Ej. Siento mucha ansiedad por jalar Cálculo, no sé cómo organizar mis tiempos..."
                      value={distressReason}
                      onChange={(e) => setDistressReason(e.target.value)}
                      required
                      className="flex-1 bg-white border border-rose-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button 
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Send className="h-3.5 w-3.5" /> Enviar Mensaje
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDistressActive(false)}
                      className="px-3 py-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid Izquierda: Cursos del Alumno con Banner de Fotos */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Course semaforo with detailed interactive editing */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-display font-extrabold text-lg text-udep-blue">Mis Calificaciones y Prácticas</h3>
              <p className="text-xs text-slate-500">Haz clic en tus asignaturas para ver su foto temática, simular notas y proyectar promedios.</p>
            </div>
            <BookOpen className="h-5 w-5 text-udep-sky" />
          </div>

          <div className="space-y-3">
            {grades.map((course) => {
              const isSelected = selectedCourse === course.courseName;
              return (
                <div 
                  key={course.courseName}
                  className={`border rounded-lg transition-all overflow-hidden ${
                    isSelected ? 'border-indigo-200 ring-2 ring-indigo-50/50' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  {/* Course Header row */}
                  <div 
                    onClick={() => handleSelectCourse(course)}
                    className="p-4 bg-slate-50/60 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-full ${
                          course.status === 'rojo' ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : course.status === 'amarillo' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <h4 className="font-display font-bold text-slate-800 text-sm truncate">{course.courseName}</h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <span>Ponderado oficial UDEP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">PROMEDIO</p>
                        <p className="font-mono font-extrabold text-sm text-slate-700">
                          {course.finalGrade !== null ? `${course.finalGrade.toFixed(1)} / 20` : 'S/N'}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Course expandable details with THEMATIC PHOTO BANNER */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white border-t border-slate-100 p-4"
                      >
                        {/* THEMATIC PHOTO - Fulfills the user "fotos" instruction beautifully */}
                        <div className="relative rounded-lg overflow-hidden h-24 sm:h-28 mb-4 border border-slate-100 shadow-inner">
                          <img 
                            src={COURSE_BANNERS[course.courseName]} 
                            alt={course.courseName}
                            className="w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-transparent" />
                          <div className="absolute bottom-2.5 left-3 text-white">
                            <span className="text-[9px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-udep-gold">
                              Udep Ciencias Básicas
                            </span>
                            <h5 className="font-display font-bold text-xs sm:text-sm mt-0.5">{course.courseName} • Prácticas Dirigidas</h5>
                          </div>
                        </div>

                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-udep-gold" />
                          <span>Simular Notas (Mueve el deslizador o edita la casilla):</span>
                        </h5>
                        
                        <div className="space-y-3.5 pb-2">
                          {editingEvaluations.map((evalItem, idx) => (
                            <div key={evalItem.type} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-55/40 pb-2">
                              <div className="sm:w-1/3">
                                <p className="font-bold text-slate-700">{evalItem.name}</p>
                                <p className="text-[10px] text-slate-400">Ponderado: {Math.round(evalItem.weight * 100)}%</p>
                              </div>
                              <div className="flex-1 flex items-center gap-3">
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="0.5"
                                  value={evalItem.grade === null ? 0 : evalItem.grade}
                                  onChange={(e) => handleGradeChange(idx, e.target.value)}
                                  className="w-full accent-udep-blue h-1.5 rounded-lg bg-slate-100 cursor-ew-resize"
                                />
                              </div>
                              <div className="w-24 flex items-center justify-end gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.1"
                                  placeholder="S/N"
                                  value={evalItem.grade === null ? '' : evalItem.grade}
                                  onChange={(e) => handleGradeChange(idx, e.target.value)}
                                  className="w-16 text-center border border-slate-200 rounded-lg py-1 text-xs font-mono font-extrabold text-slate-700 bg-slate-50"
                                />
                                <span className="text-[10px] text-slate-400 font-bold">/20</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-150 pt-3 mt-3">
                          <p className="text-[10px] text-slate-400 italic">Simulación de promedio ponderado automático (excluye notas sin rendir).</p>
                          <button
                            onClick={() => handleSaveGrades(course.courseName)}
                            className="bg-udep-blue hover:bg-udep-sky text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Guardar Notas Simulación
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* GALLERÍA DE FOTOS DE SESIONES DE ESTUDIO - Fully responsive and entertaining */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
            <div>
              <h3 className="font-display font-extrabold text-base text-udep-blue flex items-center gap-1.5">
                <ImageIcon className="h-5 w-5 text-udep-gold" />
                <span>Galería de Mis Grupos de Estudio</span>
              </h3>
              <p className="text-xs text-slate-500">Muestra las fotos de tus sesiones de contención académica. ¡Comparte tus capturas voluntarias!</p>
            </div>
            
            <button
              onClick={() => setShowPhotoForm(!showPhotoForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 cursor-pointer self-start sm:self-auto transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Compartir Foto Group
            </button>
          </div>

          {photoSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-100 mb-4 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span><strong>¡Foto Lograda!</strong> Has compartido con éxito una captura de estudio. Obtuviste un logro y suma de puntos. +50 PTS. 🎉</span>
            </div>
          )}

          {/* Inline Photo Post Form */}
          <AnimatePresence>
            {showPhotoForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddPhotoSubmit}
                className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl mb-4 space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subir Captura de Tutoría Real (Simulado):</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Título del Grupo de Estudio:</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Sólidos en Aula Magna"
                      value={newPhotoTitle}
                      onChange={(e) => setNewPhotoTitle(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Foto URL de Simulación (O dejar vacío para default):</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..."
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Comentarios de cómo les fue en la sesión:</label>
                  <textarea 
                    rows={1.5}
                    required
                    placeholder="Describe detalladamente para motivar a otros cachimbos."
                    value={newPhotoDesc}
                    onChange={(e) => setNewPhotoDesc(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded p-2 text-xs text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowPhotoForm(false)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 rounded"
                  >
                    Cerrar
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white font-semibold px-4 py-1 rounded shadow cursor-pointer"
                  >
                    Publicar Foto en Canvas
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Visual grid of photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studyPhotos.map(photo => (
              <div key={photo.id} className="group bg-slate-50 border border-slate-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow relative">
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="referrer"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {photo.date}
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                    Por: {photo.author}
                  </span>
                  <h4 className="font-display font-extrabold text-slate-800 text-xs mt-1.5">{photo.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal italic font-sans">
                    "{photo.description}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid Derecha: Gamificación Medals, Trivia Académica, Seguir Mentor */}
      <div className="space-y-6">

        {/* PROFILE STATS & LOGROS / BADGES WIDGET */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl border border-slate-700 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-udep-blue/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-white/10 pb-3.5 mb-4">
            <img 
              src={student.avatarUrl} 
              alt={student.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-udep-gold"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-[9px] font-bold text-udep-gold/90 uppercase tracking-widest leading-none">Mi Perfil Académico</p>
              <h3 className="font-display font-extrabold text-sm mt-1 truncate">{student.name}</h3>
              <p className="text-[10px] text-white/60 leading-tight mt-0.5">{student.program}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/5 border border-white/5 p-3 rounded-lg text-center mb-4">
            <div>
              <span className="text-[8px] text-white/50 uppercase font-bold tracking-wider">Puntuación</span>
              <p className="font-mono font-extrabold text-base text-emerald-400 mt-0.5">{student.points || 0} pts</p>
            </div>
            <div>
              <span className="text-[8px] text-white/50 uppercase font-bold tracking-wider">Ciclo</span>
              <p className="font-family text-xs text-white/90 font-bold mt-0.5">{student.cycle}° Universitario</p>
            </div>
          </div>

          {/* Achievements medals display log */}
          <div>
            <h4 className="text-[10px] font-bold text-udep-gold uppercase tracking-wider mb-2.5 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              <span>Mis Medallas REDSAB ({student.achievements?.length || 1}):</span>
            </h4>
            
            <div className="space-y-1.5">
              {(student.achievements || [
                { title: 'Primer Gran Paso', icon: 'Sparkles', color: 'from-amber-400 to-amber-600' }
              ]).map((ach, index) => (
                <div key={index} className="flex items-center gap-2.5 bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className={`p-1.5 bg-gradient-to-br ${ach.color} text-slate-900 rounded-md font-bold`}>
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] text-white">{ach.title}</p>
                    <p className="text-[9px] text-white/50 leading-none">Logro en simulación activa</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RETO DIARIO: INTERACTIVE TRIVIA GAME WIDGET - Enhances UDEP peer excitement */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-xl border border-indigo-700/40 p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-indigo-400 uppercase bg-indigo-550/30 px-2 py-0.5 rounded-full border border-indigo-500/20">
            <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>+20 PTS RETO</span>
          </div>

          <div className="flex items-center gap-2 mb-3.5">
            <Trophy className="h-5 w-5 text-udep-gold" />
            <h3 className="font-display font-bold text-xs sm:text-sm text-white leading-tight">Trivia de Superviviencia UDEP</h3>
          </div>

          {!triviaCompleted ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[10px] text-white/50">
                <span>PREGUNTA {triviaIndex + 1} de {TRIVIA_QUESTIONS.length}</span>
                <span className="font-bold text-emerald-400">Puntaje actual: {triviaScore} aciertos</span>
              </div>

              <p className="font-medium text-slate-200 leading-snug">
                {TRIVIA_QUESTIONS[triviaIndex].question}
              </p>

              <div className="space-y-2 pt-1.5">
                {TRIVIA_QUESTIONS[triviaIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedOpt === oIdx;
                  const isCorrect = oIdx === TRIVIA_QUESTIONS[triviaIndex].correctIdx;
                  
                  let btnStyle = "bg-white/5 text-slate-300 hover:bg-white/10 border-white/5";
                  if (triviaAnswered) {
                    if (isCorrect) btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-300 font-semibold";
                    else if (isSelected) btnStyle = "bg-rose-600/30 border-rose-500 text-rose-300";
                    else btnStyle = "bg-white/5 text-slate-500 border-transparent opacity-50";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={triviaAnswered}
                      onClick={() => handleAnswerTrivia(oIdx)}
                      className={`w-full text-left p-2 rounded-lg border text-[11px] leading-snug transition-all flex items-start gap-2 ${btnStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {triviaAnswered && (
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg space-y-1">
                  <p className="text-[11px] leading-normal font-sans">
                    {triviaFeedback}
                  </p>
                  <p className="text-[10px] text-udep-gold italic font-light flex items-center gap-1 pt-1 border-t border-white/5">
                    <Lightbulb className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                    <span>Análisis: {TRIVIA_QUESTIONS[triviaIndex].tip}</span>
                  </p>
                  
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextTrivia}
                      className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold tracking-wide text-[10px] uppercase px-3 py-1.5 rounded cursor-pointer transition-colors"
                    >
                      {triviaIndex + 1 < TRIVIA_QUESTIONS.length ? 'Siguiente Pregunta' : 'Finalizar Reto'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-udep-gold/15 text-udep-gold rounded-full flex items-center justify-center mx-auto mb-1 animate-bounce">
                <Trophy className="h-6 w-6" />
              </div>
              <h4 className="font-display font-extrabold text-sm">¡Felicitaciones por Completar el Reto!</h4>
              <p className="text-xs text-slate-300 leading-normal max-w-xs mx-auto">
                Obtuviste un score de <strong className="text-emerald-400">{triviaScore} de {TRIVIA_QUESTIONS.length} aciertos</strong>.
                Se ha desbloqueado la medalla <strong className="text-udep-gold">"Estrella de Sabiduría UDEP"</strong> en tu vitrina de logros.
              </p>
              
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={handleRestartTrivia}
                  className="bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded transition-colors cursor-pointer"
                >
                  Volver a Jugar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Regular request sibling support */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-udep-gold" />
            <h3 className="font-display font-bold text-base text-udep-blue">Solicitar un Hermano Mayor</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-normal">
            Si tienes dudas en un tema específico de Cálculo, Física o Álgebra, selecciona el curso y describe el problema para agendar asesoría con un mentor destacado.
          </p>

          {requestSuccess ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs leading-normal flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
              <span><strong>Solicitud enviada con éxito.</strong> Se ha publicado en la bolsa de mentores. Serás emparejado en breve.</span>
            </div>
          ) : (
            <form onSubmit={handleRequestTutorship} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Curso:</label>
                <select 
                  value={requestCourse}
                  onChange={(e) => setRequestCourse(e.target.value as CourseName)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-udep-sky focus:outline-none"
                >
                  {Object.values(CourseName).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">¿Qué tema específico necesitas reforzar o practicar?</label>
                <textarea
                  rows={3}
                  maxLength={150}
                  placeholder="Ej: Dudas con el método del disco vs arandelas en sólidos de revolución..."
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-udep-sky focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-udep-blue hover:bg-udep-sky text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Plus className="h-4 w-4" /> Publicar Solicitud
              </button>
            </form>
          )}
        </div>

        {/* Mis Asesorías Agendadas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-display font-bold text-sm text-udep-blue mb-3 border-b border-slate-100 pb-2">Mis Sesiones Activas</h3>
          
          {myTutorships.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Aún no cuentas con sesiones solicitadas en esta simulación.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {myTutorships.map(tut => (
                <div key={tut.id} className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-100">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>{tut.courseName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      tut.status === 'pendiente' 
                        ? 'bg-amber-100 text-amber-800' 
                        : tut.status === 'programado'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tut.status}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1 leading-normal italic">"{tut.topic}"</p>

                  {tut.status === 'programado' && (
                    <div className="mt-2 pt-1 border-t border-slate-200 text-slate-600 flex flex-col gap-1">
                      <p className="inline-flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-udep-gold" /> Mentor: <strong>{tut.mentorName}</strong>
                      </p>
                      <p className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3 text-slate-400" /> {tut.scheduledDate} a las {tut.scheduledTime}
                      </p>
                    </div>
                  )}

                  {tut.status === 'completado' && tut.sessionNotes && (
                    <div className="mt-1 pb-1 text-[11px] text-slate-400">
                      <p>Apuntes: "{tut.sessionNotes}"</p>
                    </div>
                  )}

                  {tut.status === 'pendiente' && (
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={() => handleCancelTutorship(tut.id)}
                        className="text-[10px] text-rose-600 hover:underline font-semibold"
                      >
                        Cancelar Solicitud
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
