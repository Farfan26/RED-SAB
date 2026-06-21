export enum AcademicRisk {
  Low = 'LOW',       // Green (Promedio >= 14)
  Medium = 'MEDIUM',  // Yellow (Promedio 11.5 - 13.9)
  High = 'HIGH'       // Red (Promedio < 11.5)
}

export enum UserRole {
  Mentee = 'MENTEE',
  Mentor = 'MENTOR',
  Bienestar = 'BIENESTAR'
}

export interface Course {
  id: string;
  name: string;
  code: string;
  category: 'Ciencias Básicas' | 'Metodología' | 'Otros';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  carrera: string;
  ciclo: number;
  promedio: number;
  grades: { [courseId: string]: number[] }; // Map courseId to their partial grades
  risk: AcademicRisk;
  mentorId?: string;
  ecopuntos: number;
  streak: number;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  carrera: string;
  ciclo: number;
  maxMentees: number; // usually 4
  menteeIds: string[];
  horasVoluntariado: number;
  especialidades: string[]; // e.g. ["Cálculo I", "Álgebra"]
}

export interface AcademicAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentCarrera: string;
  courseId: string;
  courseName: string;
  average: number;
  timestamp: string;
  status: 'Pendiente' | 'Atendido';
  atendidoAt?: string;
  notes?: string;
}

export interface LessonCapsule {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  duration: string; // e.g., "4:20"
  description: string;
  videoUrlMock: string; // Fake thumbnail/player mockup
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LoanItem {
  id: string;
  name: string;
  type: 'Calculadora' | 'Libro';
  serialOrTitle: string;
  totalStock: number;
  availableStock: number;
  ecopuntosCost: number; // gamified cost or benefit
}

export interface LoanRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'Calculadora' | 'Libro';
  studentId: string;
  studentName: string;
  requestDate: string;
  dueDate: string;
  status: 'Prestado' | 'Devuelto' | 'Retrasado';
}

export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  description: string;
}
