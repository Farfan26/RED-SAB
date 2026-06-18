/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoleType = 'becado' | 'mentor' | 'bienestar';

export enum CourseName {
  CalculoI = "Cálculo I",
  AlgebraLineal = "Álgebra Lineal",
  FisicaGeneral = "Física General",
  IntroIngenieria = "Introducción a la Ingeniería",
  LenguaEspanola = "Lengua Española"
}

export type EvaluationType = 'PR1' | 'PR2' | 'EXA_PAR' | 'PR3' | 'EXA_FIN';

export interface Evaluation {
  type: EvaluationType;
  name: string;
  grade: number | null; // scale from 0 to 20
  weight: number; // percentage (e.g., 20% -> 0.20)
}

export interface CourseGrade {
  courseName: CourseName;
  evaluations: Evaluation[];
  finalGrade: number | null; // calculated average
  status: 'verde' | 'amarillo' | 'rojo'; // rojo < 10.5, amarillo 10.5-13.9, verde 14.0+
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role: 'becado' | 'mentor';
  faculty: 'Ingeniería' | 'Ciencias Económicas y Empresariales';
  program: string; // e.g. "Ingeniería Industrial y de Sistemas", "Economía"
  cycle: number; // 1 to 3
  avgGrade: number;
  status: 'verde' | 'amarillo' | 'rojo';
  avatarUrl: string;
  bio?: string;
  points?: number; // for mentors
  beconRewardClaimed?: string[]; // IDs of rewards claimed
}

export interface TutorshipRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  courseName: CourseName;
  topic: string;
  status: 'pendiente' | 'programado' | 'completado' | 'cancelado';
  requestedDate: string; // ISO date string
  scheduledDate?: string; // scheduled date
  scheduledTime?: string; // scheduled time
  mentorId?: string;
  mentorName?: string;
  sessionNotes?: string;
  durationMinutes?: number;
  ratingByMentee?: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  originalStock: number;
  availableStock: number;
  imageIcon: string; // lucide icon name
  category: 'calculadora' | 'libro' | 'accesorio';
}

export interface SharedResource {
  id: string;
  title: string;
  courseName: CourseName;
  type: 'video' | 'pdf' | 'simulacion';
  duration?: string; // for videos (e.g., "4:15")
  url: string; // simulate a Google Drive link
  description: string;
  authorName: string;
  downloadsOrViews: number;
}
