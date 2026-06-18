/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, CourseGrade, TutorshipRequest, RewardItem, SharedResource, CourseName, Evaluation } from '../types';
import { INITIAL_MENTORS, INITIAL_STUDENTS_BECADOS, SEED_GRADES_JUAN, DEFAULT_EVALUATIONS_FOR_CURSE, INITIAL_REWARDS, INITIAL_RESOURCES, INITIAL_TUTORSHIPS } from '../data';

// Helper to load or initialize local storage keys
function getLocalStorage<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}

function setLocalStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Keys
const KEY_BECADOS = 'redsab_becados';
const KEY_MENTORS = 'redsab_mentors';
const KEY_TUTORSHIPS = 'redsab_tutorships';
const KEY_REWARDS = 'redsab_rewards';
const KEY_RESOURCES = 'redsab_resources';
const KEY_GRADES_PREFIX = 'redsab_grades_';
const KEY_PSYCHO_ALERTS = 'redsab_psycho_alerts';

export interface PsychoAlert {
  id: string;
  studentId: string;
  studentName: string;
  courseName?: CourseName;
  reason: string;
  date: string;
  status: 'pendiente' | 'atendido';
  notes?: string;
}

export function initializeDB(): void {
  if (!localStorage.getItem(KEY_BECADOS)) {
    setLocalStorage(KEY_BECADOS, INITIAL_STUDENTS_BECADOS);
  }
  if (!localStorage.getItem(KEY_MENTORS)) {
    setLocalStorage(KEY_MENTORS, INITIAL_MENTORS);
  }
  if (!localStorage.getItem(KEY_TUTORSHIPS)) {
    setLocalStorage(KEY_TUTORSHIPS, INITIAL_TUTORSHIPS);
  }
  if (!localStorage.getItem(KEY_REWARDS)) {
    setLocalStorage(KEY_REWARDS, INITIAL_REWARDS);
  }
  if (!localStorage.getItem(KEY_RESOURCES)) {
    setLocalStorage(KEY_RESOURCES, INITIAL_RESOURCES);
  }
  if (!localStorage.getItem(KEY_PSYCHO_ALERTS)) {
    const initialAl: PsychoAlert[] = [
      {
        id: "alert-1",
        studentId: "becado-1",
        studentName: "Juan Manuel Ortiz Ruiz",
        courseName: CourseName.CalculoI,
        reason: "Bajo rendimiento consecutivo en Práctica 1 y 2. Reportó altos niveles de ansiedad por perder la beca.",
        date: "2026-06-17T11:20:00-05:00",
        status: "pendiente"
      }
    ];
    setLocalStorage(KEY_PSYCHO_ALERTS, initialAl);
  }

  // Prepopulate grades for Juan Manuel Ortiz (becado-1)
  const gradesKeyJuan = `${KEY_GRADES_PREFIX}becado-1`;
  if (!localStorage.getItem(gradesKeyJuan)) {
    setLocalStorage(gradesKeyJuan, SEED_GRADES_JUAN);
  }

  // Prepopulate empty/default grades for other students if not set
  INITIAL_STUDENTS_BECADOS.forEach(stud => {
    if (stud.id !== 'becado-1') {
      const gradesKey = `${KEY_GRADES_PREFIX}${stud.id}`;
      if (!localStorage.getItem(gradesKey)) {
        const defaultGrades: CourseGrade[] = [
          DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.CalculoI),
          DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.AlgebraLineal),
          DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.FisicaGeneral),
          DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.IntroIngenieria),
          DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.LenguaEspanola)
        ];
        // Give Mateo Flores some nice mock grades to justify his 'verde' indicator
        if (stud.id === 'becado-3') {
          defaultGrades[0].evaluations[0].grade = 14; // Calculo PR1
          defaultGrades[0].evaluations[1].grade = 15; // Calculo PR2
          defaultGrades[1].evaluations[0].grade = 16; // Algebra PR1
          recalculateCourseGrade(defaultGrades[0]);
          recalculateCourseGrade(defaultGrades[1]);
        }
        // Give Milagros Chunga some 'amarillo' grades
        if (stud.id === 'becado-2') {
          defaultGrades[0].evaluations[0].grade = 12; // Calculo PR1
          defaultGrades[0].evaluations[1].grade = 11; // Calculo PR2
          defaultGrades[1].evaluations[0].grade = 13; // Algebra PR1
          recalculateCourseGrade(defaultGrades[0]);
          recalculateCourseGrade(defaultGrades[1]);
        }
        setLocalStorage(gradesKey, defaultGrades);
      }
    }
  });
}

// Logic to recalculate course grades when entries change.
export function recalculateCourseGrade(courseGrade: CourseGrade): void {
  const gradedItems = courseGrade.evaluations.filter(e => e.grade !== null);
  if (gradedItems.length === 0) {
    courseGrade.finalGrade = null;
    courseGrade.status = 'verde'; // default green or white
    return;
  }

  const weightedSum = gradedItems.reduce((sum, e) => sum + (e.grade! * e.weight), 0);
  const totalWeight = gradedItems.reduce((sum, e) => sum + e.weight, 0);

  // Normalize current standing to base 20
  const calculated = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  // Round to 1 decimal place
  courseGrade.finalGrade = Math.round(calculated * 10) / 10;

  if (courseGrade.finalGrade < 10.5) {
    courseGrade.status = 'rojo';
  } else if (courseGrade.finalGrade < 14.0) {
    courseGrade.status = 'amarillo';
  } else {
    courseGrade.status = 'verde';
  }
}

// DB GETTERS
export function getBecados(): Student[] {
  return getLocalStorage<Student[]>(KEY_BECADOS, []);
}

export function getMentors(): Student[] {
  return getLocalStorage<Student[]>(KEY_MENTORS, []);
}

export function getAllUsers(): Student[] {
  return [...getBecados(), ...getMentors()];
}

export function getTutorships(): TutorshipRequest[] {
  return getLocalStorage<TutorshipRequest[]>(KEY_TUTORSHIPS, []);
}

export function getRewards(): RewardItem[] {
  return getLocalStorage<RewardItem[]>(KEY_REWARDS, []);
}

export function getResources(): SharedResource[] {
  return getLocalStorage<SharedResource[]>(KEY_RESOURCES, []);
}

export function getPsychoAlerts(): PsychoAlert[] {
  return getLocalStorage<PsychoAlert[]>(KEY_PSYCHO_ALERTS, []);
}

export function getStudentGrades(studentId: string): CourseGrade[] {
  const gradesKey = `${KEY_GRADES_PREFIX}${studentId}`;
  const defaultGrades: CourseGrade[] = [
    DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.CalculoI),
    DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.AlgebraLineal),
    DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.FisicaGeneral),
    DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.IntroIngenieria),
    DEFAULT_EVALUATIONS_FOR_CURSE(CourseName.LenguaEspanola)
  ];
  return getLocalStorage<CourseGrade[]>(gradesKey, defaultGrades);
}

// DB MUTATORS
export function saveStudentGrades(studentId: string, grades: CourseGrade[]): void {
  // Recalculate each course grade first
  grades.forEach(g => recalculateCourseGrade(g));
  
  // Save to student course grades
  const gradesKey = `${KEY_GRADES_PREFIX}${studentId}`;
  setLocalStorage(gradesKey, grades);

  // Re-evaluate overall student status based on average of current grades
  const gradedCourses = grades.filter(g => g.finalGrade !== null);
  let overallAvg = 13.0;
  let overallStatus: 'verde' | 'amarillo' | 'rojo' = 'verde';

  if (gradedCourses.length > 0) {
    const totalGrades = gradedCourses.reduce((sum, g) => sum + g.finalGrade!, 0);
    overallAvg = Math.round((totalGrades / gradedCourses.length) * 10) / 10;
    
    // If any course is Red, overall risk is higher.
    const hasRedCourse = gradedCourses.some(g => g.status === 'rojo');
    const hasYellowCourse = gradedCourses.some(g => g.status === 'amarillo');
    
    if (hasRedCourse || overallAvg < 10.5) {
      overallStatus = 'rojo';
    } else if (hasYellowCourse || overallAvg < 14.0) {
      overallStatus = 'amarillo';
    } else {
      overallStatus = 'verde';
    }
  }

  // Update student entry in student list
  const students = getBecados();
  const index = students.findIndex(s => s.id === studentId);
  if (index !== -1) {
    students[index].avgGrade = overallAvg;
    students[index].status = overallStatus;
    setLocalStorage(KEY_BECADOS, students);
  }
}

export function createTutorshipRequest(request: Omit<TutorshipRequest, 'id' | 'status' | 'requestedDate'>): TutorshipRequest {
  const tuts = getTutorships();
  const newRequest: TutorshipRequest = {
    ...request,
    id: `tut-${Date.now()}`,
    status: 'pendiente',
    requestedDate: new Date().toISOString()
  };
  tuts.unshift(newRequest);
  setLocalStorage(KEY_TUTORSHIPS, tuts);
  return newRequest;
}

export function acceptTutorshipRequest(requestId: string, mentorId: string, mentorName: string, date: string, time: string): void {
  const tuts = getTutorships();
  const index = tuts.findIndex(t => t.id === requestId);
  if (index !== -1) {
    tuts[index].status = 'programado';
    tuts[index].mentorId = mentorId;
    tuts[index].mentorName = mentorName;
    tuts[index].scheduledDate = date;
    tuts[index].scheduledTime = time;
    setLocalStorage(KEY_TUTORSHIPS, tuts);
  }
}

export function completeTutorshipSession(requestId: string, sessionNotes: string, durationMinutes: number): void {
  const tuts = getTutorships();
  const index = tuts.findIndex(t => t.id === requestId);
  if (index !== -1) {
    tuts[index].status = 'completado';
    tuts[index].sessionNotes = sessionNotes;
    tuts[index].durationMinutes = durationMinutes;

    const mentorId = tuts[index].mentorId;
    if (mentorId) {
      // Award points (e.g. 50 points per tutorship logged)
      const mentors = getMentors();
      const mIdx = mentors.findIndex(m => m.id === mentorId);
      if (mIdx !== -1) {
        mentors[mIdx].points = (mentors[mIdx].points || 0) + 50;
        setLocalStorage(KEY_MENTORS, mentors);
      }
    }
    setLocalStorage(KEY_TUTORSHIPS, tuts);
  }
}

export function cancelTutorshipRequest(requestId: string): void {
  const tuts = getTutorships();
  const index = tuts.findIndex(t => t.id === requestId);
  if (index !== -1) {
    tuts[index].status = 'cancelado';
    setLocalStorage(KEY_TUTORSHIPS, tuts);
  }
}

export function claimReward(studentId: string, rewardId: string): { success: boolean; message: string } {
  const students = getAllUsers();
  const student = students.find(s => s.id === studentId);
  const rewards = getRewards();
  const reward = rewards.find(r => r.id === rewardId);

  if (!student) {
    return { success: false, message: "Estudiante no encontrado." };
  }
  if (!reward) {
    return { success: false, message: "Recompensa o material no encontrado." };
  }
  
  const currentPoints = student.points || 0;
  if (currentPoints < reward.pointsCost) {
    return { success: false, message: `Puntos insuficientes. Requiere ${reward.pointsCost} pts (tienes ${currentPoints} pts).` };
  }

  if (reward.availableStock <= 0) {
    return { success: false, message: "No hay stock disponible de este material por el momento." };
  }

  // Deduct points
  if (student.role === 'mentor') {
    const mentors = getMentors();
    const idx = mentors.findIndex(m => m.id === studentId);
    if (idx !== -1) {
      mentors[idx].points = (mentors[idx].points || 0) - reward.pointsCost;
      mentors[idx].beconRewardClaimed = mentors[idx].beconRewardClaimed || [];
      mentors[idx].beconRewardClaimed!.push(rewardId);
      setLocalStorage(KEY_MENTORS, mentors);
    }
  } else {
    // becado
    const becados = getBecados();
    const idx = becados.findIndex(b => b.id === studentId);
    if (idx !== -1) {
      becados[idx].points = (becados[idx].points || 0) - reward.pointsCost;
      becados[idx].beconRewardClaimed = becados[idx].beconRewardClaimed || [];
      becados[idx].beconRewardClaimed!.push(rewardId);
      setLocalStorage(KEY_BECADOS, becados);
    }
  }

  // Deduct stock
  reward.availableStock -= 1;
  setLocalStorage(KEY_REWARDS, rewards);

  return { success: true, message: `¡Canje exitoso! Se restaron ${reward.pointsCost} puntos. Retira tu ${reward.name} en la Oficina de Bienestar Universitario.` };
}

export function triggerPsychoAlert(studentId: string, studentName: string, reason: string, courseName?: CourseName): PsychoAlert {
  const alerts = getPsychoAlerts();
  const newAlert: PsychoAlert = {
    id: `alert-${Date.now()}`,
    studentId,
    studentName,
    courseName,
    reason,
    date: new Date().toISOString(),
    status: 'pendiente'
  };
  alerts.unshift(newAlert);
  setLocalStorage(KEY_PSYCHO_ALERTS, alerts);
  return newAlert;
}

export function updatePsychoAlertStatus(alertId: string, status: 'pendiente' | 'atendido', notes?: string): void {
  const alerts = getPsychoAlerts();
  const index = alerts.findIndex(a => a.id === alertId);
  if (index !== -1) {
    alerts[index].status = status;
    if (notes) alerts[index].notes = notes;
    setLocalStorage(KEY_PSYCHO_ALERTS, alerts);
  }
}

export function addSharedResource(resource: Omit<SharedResource, 'id' | 'downloadsOrViews'>): SharedResource {
  const resources = getResources();
  const newResource: SharedResource = {
    ...resource,
    id: `res-${Date.now()}`,
    downloadsOrViews: 0
  };
  resources.unshift(newResource);
  setLocalStorage(KEY_RESOURCES, resources);
  return newResource;
}

export function incrementResourceCounter(resourceId: string): void {
  const resources = getResources();
  const index = resources.findIndex(r => r.id === resourceId);
  if (index !== -1) {
    resources[index].downloadsOrViews += 1;
    setLocalStorage(KEY_RESOURCES, resources);
  }
}
