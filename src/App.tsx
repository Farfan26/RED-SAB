import React, { useState } from 'react';
import { UserRole, Student, Mentor, AcademicAlert, LoanItem, LoanRequest, AcademicRisk } from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_MENTORS,
  INITIAL_COURSES,
  INITIAL_CAPSULES,
  INITIAL_LOAN_ITEMS,
  INITIAL_LOAN_REQUESTS,
} from './data';

import Header from './components/Header';
import MenteePanel from './components/MenteePanel';
import MentorPanel from './components/MentorPanel';
import BienestarPanel from './components/BienestarPanel';
import BudgetSection from './components/BudgetSection';
import ProjectInfo from './components/ProjectInfo';

import { Sparkles, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  // Global simulated states
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.Mentee);
  const [activeTab, setActiveTab] = useState<'app' | 'budget' | 'theory'>('app');

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [loanItems, setLoanItems] = useState<LoanItem[]>(INITIAL_LOAN_ITEMS);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(INITIAL_LOAN_REQUESTS);

  // Preseeded Welfare alerts queue
  const [alerts, setAlerts] = useState<AcademicAlert[]>([
    {
      id: 'alert-1',
      studentId: 'b-101',
      studentName: 'Kevin Alexander Quispe',
      studentCarrera: 'Ingeniería Industrial y de Sistemas',
      courseId: 'calc-1',
      courseName: 'Cálculo I',
      average: 9.3,
      timestamp: 'Fiel hace 2 horas',
      status: 'Pendiente'
    },
    {
      id: 'alert-2',
      studentId: 'b-104',
      studentName: 'Estrella Marina Castro',
      studentCarrera: 'Arquitectura',
      courseId: 'calc-1',
      courseName: 'Cálculo I',
      average: 9.0,
      timestamp: 'Fiel hace 4 horas',
      status: 'Pendiente'
    }
  ]);

  // Toast System
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // State Handler 1: Grade logging & Reactive alert system
  const handleAddGrade = (studentId: string, courseId: string, grade: number) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id !== studentId) return student;

        // Clone and push new grade
        const updatedCourseGrades = [...(student.grades[courseId] || []), grade];
        const newGrades = {
          ...student.grades,
          [courseId]: updatedCourseGrades
        };

        // Recalculate average
        let sumAverages = 0;
        let countedCourses = 0;

        Object.keys(newGrades).forEach(cId => {
          const grades = newGrades[cId];
          if (grades.length > 0) {
            sumAverages += (grades.reduce((a, b) => a + b, 0)) / grades.length;
            countedCourses++;
          }
        });

        const newPromedio = countedCourses > 0 ? sumAverages / countedCourses : student.promedio;

        // Compute risk status
        let newRisk = AcademicRisk.Low;
        if (newPromedio < 11.5) {
          newRisk = AcademicRisk.High;
        } else if (newPromedio < 14.0) {
          newRisk = AcademicRisk.Medium;
        }

        // Trigger predictive alert log on HIGH risk state transitions
        if (newRisk === AcademicRisk.High && student.risk !== AcademicRisk.High) {
          const courseObj = INITIAL_COURSES.find(c => c.id === courseId);
          const newAlert: AcademicAlert = {
            id: `alert-gen-${Date.now()}`,
            studentId: student.id,
            studentName: student.name,
            studentCarrera: student.carrera,
            courseId: courseId,
            courseName: courseObj?.name || 'Asignatura Crítica',
            average: newPromedio,
            timestamp: 'Recién emitido',
            status: 'Pendiente'
          };
          setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
          showToast(`⚠️ Alerta predictiva enviada a Bienestar para ${student.name}`, 'alert');
        } else {
          showToast(`Calificación registrada para ${student.name}. Promedio actual: ${newPromedio.toFixed(1)}`);
        }

        return {
          ...student,
          grades: newGrades,
          promedio: newPromedio,
          risk: newRisk
        };
      });
    });
  };

  // State Handler 2: Log tutoring hours (Mentor)
  const handleLogHours = (mentorId: string, hours: number, description: string) => {
    setMentors(prevMentors => {
      return prevMentors.map(mentor => {
        if (mentor.id === mentorId) {
          const updatedHours = mentor.horasVoluntariado + hours;
          showToast(`Acreditación registrada: +${hours} h. Total acumulado: ${updatedHours} h`);
          return {
            ...mentor,
            horasVoluntariado: updatedHours
          };
        }
        return mentor;
      });
    });
  };

  // State Handler 3: Conclude alert (Bienestar)
  const handleAttendAlert = (alertId: string, notes: string) => {
    setAlerts(prevAlerts => {
      return prevAlerts.map(alert => {
        if (alert.id === alertId) {
          showToast(`Caso de ${alert.studentName} mitigado exitosamente.`);
          return {
            ...alert,
            status: 'Atendido' as const,
            notes: notes,
            atendidoAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
          };
        }
        return alert;
      });
    });
  };

  // State Handler 4: Execute smart matching (Bienestar)
  const handleExecuteMatching = () => {
    const unassigned = students.find(s => !s.mentorId);
    const availableMentor = mentors.find(m => m.menteeIds.length < m.maxMentees);

    if (!unassigned || !availableMentor) {
      showToast('No cumple criterios de emparejamiento o cupos limitados.', 'info');
      return;
    }

    // Pair Estrella Marina or others
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === unassigned.id) {
          return { ...student, mentorId: availableMentor.id };
        }
        return student;
      });
    });

    setMentors(prevMentors => {
      return prevMentors.map(mentor => {
        if (mentor.id === availableMentor.id) {
          return {
            ...mentor,
            menteeIds: [...mentor.menteeIds, unassigned.id]
          };
        }
        return mentor;
      });
    });

    showToast(`🤖 Algoritmo: Acoplamiento exitoso entre ${unassigned.name} y la tutora ${availableMentor.name}!`, 'success');
  };

  // State Handler 5: Replenish hardware/books
  const handleReplenishStock = (itemId: string, count: number) => {
    setLoanItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          showToast(`Auditoría: Reaprovisionamiento exitoso de ${item.name}`);
          return {
            ...item,
            totalStock: item.totalStock + count,
            availableStock: item.availableStock + count
          };
        }
        return item;
      });
    });
  };

  // State Handler 6: Request hardware loan (Mentee)
  const handleRequestLoan = (studentId: string, itemId: string) => {
    const targetItem = loanItems.find(i => i.id === itemId);
    const targetStudent = students.find(s => s.id === studentId);

    if (!targetItem || !targetStudent || targetItem.availableStock <= 0 || targetStudent.ecopuntos < targetItem.ecopuntosCost) {
      showToast('No se puede procesar el préstamo.', 'info');
      return;
    }

    // Deduct stock
    setLoanItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, availableStock: item.availableStock - 1 };
        }
        return item;
      });
    });

    // Deduct student Ecopuntos
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, ecopuntos: student.ecopuntos - targetItem.ecopuntosCost };
        }
        return student;
      });
    });

    // Create loan request
    const newRequest: LoanRequest = {
      id: `loan-${Date.now()}`,
      itemId: itemId,
      itemName: targetItem.name,
      itemType: targetItem.type,
      studentId: studentId,
      studentName: targetStudent.name,
      requestDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days later
      status: 'Prestado'
    };

    setLoanRequests(prevRequests => [newRequest, ...prevRequests]);
    showToast(`Calculadora reservada. Código QR listo para recojo físico.`);
  };

  // State Handler 7: Return library/hardware loan (Bienestar)
  const handleReturnLoan = (loanId: string) => {
    const targetLoan = loanRequests.find(l => l.id === loanId);
    if (!targetLoan) return;

    // Restore stock
    setLoanItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === targetLoan.itemId) {
          return { ...item, availableStock: Math.min(item.totalStock, item.availableStock + 1) };
        }
        return item;
      });
    });

    // Mark loan as returned
    setLoanRequests(prevRequests => {
      return prevRequests.map(req => {
        if (req.id === loanId) {
          return { ...req, status: 'Devuelto' as const };
        }
        return req;
      });
    });

    // Award bonus ecopuntos & streak to student for prompt return
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === targetLoan.studentId) {
          return {
            ...student,
            ecopuntos: student.ecopuntos + 40,
            streak: student.streak + 1
          };
        }
        return student;
      });
    });

    showToast(`Material devuelto exitosamente. ¡Estudiante bonificado con +40 Ecopuntos!`);
  };

  // Gamification helpers
  const handleAddEcopuntos = (studentId: string, amount: number) => {
    setStudents(prevStudents => {
      return prevStudents.map(s => {
        if (s.id === studentId) {
          return { ...s, ecopuntos: s.ecopuntos + amount };
        }
        return s;
      });
    });
    showToast(`🎓 ¡Quiz superado! Ganaste +${amount} EcoPuntos`, 'success');
  };

  const handleIncreaseStreak = (studentId: string) => {
    setStudents(prevStudents => {
      return prevStudents.map(s => {
        if (s.id === studentId) {
          return { ...s, streak: s.streak + 1 };
        }
        return s;
      });
    });
  };

  // Counters for header
  const totalAlertsCount = alerts.length;
  const resolvedAlertsCount = alerts.filter(a => a.status === 'Atendido').length;

  return (
    <div className="min-h-screen bg-udep-cream pb-12 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Header with custom metrics and role toggle triggers */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resolvedAlertsCount={resolvedAlertsCount}
        totalAlertsCount={totalAlertsCount}
      />

      {/* 2. Primary Layout Render */}
      <main className="max-w-7xl mx-auto w-full px-4 mt-6 flex-grow">
        
        {/* TAB 1: App Interface Simulator */}
        {activeTab === 'app' && (
          <div className="bg-slate-50 border border-slate-200/85 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
            {/* Visual marker inside frame */}
            <div className="bg-slate-900/5 px-4 py-2 text-xxs font-mono text-slate-500 border-b flex justify-between items-center">
              <span>🖥️ SIMULACIÓN MVP PWA COMPLETAMENTE OPERATIVA</span>
              <span className="bg-udep-yellow/20 text-udep-blue-dark font-semibold px-2 py-0.5 rounded text-[9px]">
                Modo: {currentRole === UserRole.Mentee ? 'Estudiante Becario' : currentRole === UserRole.Mentor ? 'Hermano Mayor' : 'Oficina de Bienestar'}
              </span>
            </div>

            {/* Render Role Panels */}
            {currentRole === UserRole.Mentee && (
              <MenteePanel
                student={students[0]} // Simulate view as Kevin Quispe
                allCourses={INITIAL_COURSES}
                allCapsules={INITIAL_CAPSULES}
                allLoanItems={loanItems}
                allMentors={mentors}
                onAddGrade={handleAddGrade}
                onRequestLoan={handleRequestLoan}
                activeLoans={loanRequests}
                onAddEcopuntos={handleAddEcopuntos}
                onIncreaseStreak={handleIncreaseStreak}
              />
            )}

            {currentRole === UserRole.Mentor && (
              <MentorPanel
                mentor={mentors[0]} // Simulate view as Sofia Benites
                allMentees={students}
                allCourses={INITIAL_COURSES}
                onLogHours={handleLogHours}
              />
            )}

            {currentRole === UserRole.Bienestar && (
              <BienestarPanel
                students={students}
                mentors={mentors}
                alerts={alerts}
                loanItems={loanItems}
                loanRequests={loanRequests}
                onAttendAlert={handleAttendAlert}
                onExecuteMatching={handleExecuteMatching}
                onReplenishStock={handleReplenishStock}
                onReturnLoan={handleReturnLoan}
              />
            )}
          </div>
        )}

        {/* TAB 2: Budget Investment Slide 9 Model */}
        {activeTab === 'budget' && (
          <div className="bg-white border rounded-3xl shadow-xl p-2">
            <BudgetSection />
          </div>
        )}

        {/* TAB 3: Theoretical context and causal logic */}
        {activeTab === 'theory' && (
          <div className="bg-white border rounded-3xl shadow-xl p-2 animate-fade-in">
            <ProjectInfo />
          </div>
        )}

      </main>

      {/* 3. Floating Toasts alerts */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl max-w-sm transition-all animate-bounce">
          <div className="flex-shrink-0">
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
            {toast.type === 'alert' && <AlertTriangle className="h-5 w-5 text-rose-400 animate-pulse" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-sky-400" />}
          </div>
          <p className="text-xs font-semibold leading-snug">{toast.message}</p>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white pb-3 pl-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
