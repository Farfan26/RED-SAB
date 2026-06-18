/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CourseName, Student, TutorshipRequest, RewardItem, SharedResource, CourseGrade } from './types';

export const INITIAL_MENTORS: Student[] = [
  {
    id: "mentor-1",
    name: "Gretta Lucía Cabrera Campos",
    email: "gretta.cabrera@udep.pe",
    role: "mentor",
    faculty: "Ingeniería",
    program: "Ingeniería Industrial y de Sistemas",
    cycle: 8,
    avgGrade: 17.5,
    status: "verde",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    bio: "Apasionada por las matemáticas, el Cálculo I y la estadística. ¡Listo para ayudarte a dominar las derivadas!",
    points: 320
  },
  {
    id: "mentor-2",
    name: "Dany Joel Farfán Moscol",
    email: "farfandany2002@gmail.com",
    role: "mentor",
    faculty: "Ingeniería",
    program: "Ingeniería Industrial y de Sistemas",
    cycle: 9,
    avgGrade: 18.2,
    status: "verde",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Especialista en Álgebra Lineal y Física General. Me enfoco en metodologías prácticas de resolución de problemas complejos.",
    points: 450
  },
  {
    id: "mentor-3",
    name: "Katherine Lizeth Rujel Vílchez",
    email: "katherine.rujel@udep.pe",
    role: "mentor",
    faculty: "Ciencias Económicas y Empresariales",
    program: "Economía",
    cycle: 7,
    avgGrade: 16.8,
    status: "verde",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Te ayudo con técnicas de estudio efectivas y Cálculo I aplicado a la economía. ¡No estás solo en este camino!",
    points: 180
  },
  {
    id: "mentor-4",
    name: "Evelyn Nicol Zapata Lachira",
    email: "evelyn.zapata@udep.pe",
    role: "mentor",
    faculty: "Ingeniería",
    program: "Ingeniería Civil",
    cycle: 6,
    avgGrade: 17.1,
    status: "verde",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    bio: "Física General e Introducción a la Ingeniería son mis fuertes. ¡Vamos a asegurar tu beca y tu futuro!",
    points: 250
  }
];

export const INITIAL_STUDENTS_BECADOS: Student[] = [
  {
    id: "becado-1",
    name: "Juan Manuel Ortiz Ruiz",
    email: "juan.ortiz@udep.pe",
    role: "becado",
    faculty: "Ingeniería",
    program: "Ingeniería Civil",
    cycle: 1,
    avgGrade: 10.4,
    status: "rojo",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    bio: "Hola, soy ingresante Beca 18 de Ayabaca. Se me dificulta adaptarme al ritmo rápido de Cálculo I y Física General."
  },
  {
    id: "becado-2",
    name: "Milagros Sofía Chunga Paz",
    email: "milagros.chunga@udep.pe",
    role: "becado",
    faculty: "Ciencias Económicas y Empresariales",
    program: "Economía",
    cycle: 2,
    avgGrade: 12.8,
    status: "amarillo",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    bio: "Siento mucha presión de no perder mi Beca de Bienestar. Álgebra Lineal se me está haciendo abstracto."
  },
  {
    id: "becado-3",
    name: "Mateo Josué Flores Castillo",
    email: "mateo.flores@udep.pe",
    role: "becado",
    faculty: "Ingeniería",
    program: "Ingeniería Industrial y de Sistemas",
    cycle: 1,
    avgGrade: 14.8,
    status: "verde",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    bio: "Estudiando duro desde Huancabamba. Quiero adelantar temas y resolver exámenes pasados con un mentor."
  }
];

export const DEFAULT_EVALUATIONS_FOR_CURSE = (courseName: CourseName): CourseGrade => {
  let isMath = courseName === CourseName.CalculoI || courseName === CourseName.AlgebraLineal || courseName === CourseName.FisicaGeneral;
  
  if (isMath) {
    return {
      courseName,
      evaluations: [
        { type: 'PR1', name: "Práctica Calificada 1", grade: null, weight: 0.15 },
        { type: 'PR2', name: "Práctica Calificada 2", grade: null, weight: 0.15 },
        { type: 'EXA_PAR', name: "Examen Parcial", grade: null, weight: 0.25 },
        { type: 'PR3', name: "Práctica Calificada 3", grade: null, weight: 0.15 },
        { type: 'EXA_FIN', name: "Examen Final", grade: null, weight: 0.30 }
      ],
      finalGrade: null,
      status: 'verde'
    };
  } else {
    return {
      courseName,
      evaluations: [
        { type: 'PR1', name: "Trabajo Continuo 1", grade: null, weight: 0.20 },
        { type: 'PR2', name: "Trabajo Continuo 2", grade: null, weight: 0.20 },
        { type: 'EXA_PAR', name: "Examen Parcial", grade: null, weight: 0.25 },
        { type: 'PR3', name: "Trabajo Continuo 3", grade: null, weight: 0.10 },
        { type: 'EXA_FIN', name: "Examen Final/Ensayo", grade: null, weight: 0.25 }
      ],
      finalGrade: null,
      status: 'verde'
    };
  }
};

// Seed grades for student 1 (At risk: Rojo)
export const SEED_GRADES_JUAN: CourseGrade[] = [
  {
    courseName: CourseName.CalculoI,
    evaluations: [
      { type: 'PR1', name: "Práctica Calificada 1", grade: 8.5, weight: 0.15 },
      { type: 'PR2', name: "Práctica Calificada 2", grade: 9.5, weight: 0.15 },
      { type: 'EXA_PAR', name: "Examen Parcial", grade: 10.0, weight: 0.25 },
      { type: 'PR3', name: "Práctica Calificada 3", grade: null, weight: 0.15 },
      { type: 'EXA_FIN', name: "Examen Final", grade: null, weight: 0.30 }
    ],
    get finalGrade() {
      // 8.5*0.15 + 9.5*0.15 + 10*0.25 = 1.275 + 1.425 + 2.5 = 5.2 / 0.55 = 9.45
      return 9.5;
    },
    status: 'rojo'
  },
  {
    courseName: CourseName.FisicaGeneral,
    evaluations: [
      { type: 'PR1', name: "Práctica Calificada 1", grade: 11.0, weight: 0.15 },
      { type: 'PR2', name: "Práctica Calificada 2", grade: 9.0, weight: 0.15 },
      { type: 'EXA_PAR', name: "Examen Parcial", grade: 10.5, weight: 0.25 },
      { type: 'PR3', name: "Práctica Calificada 3", grade: null, weight: 0.15 },
      { type: 'EXA_FIN', name: "Examen Final", grade: null, weight: 0.30 }
    ],
    get finalGrade() {
      return 10.2;
    },
    status: 'rojo'
  },
  {
    courseName: CourseName.AlgebraLineal,
    evaluations: [
      { type: 'PR1', name: "Práctica Calificada 1", grade: 12.0, weight: 0.15 },
      { type: 'PR2', name: "Práctica Calificada 2", grade: 11.5, weight: 0.15 },
      { type: 'EXA_PAR', name: "Examen Parcial", grade: 11.0, weight: 0.25 },
      { type: 'PR3', name: "Práctica Calificada 3", grade: null, weight: 0.15 },
      { type: 'EXA_FIN', name: "Examen Final", grade: null, weight: 0.30 }
    ],
    get finalGrade() {
      return 11.4;
    },
    status: 'amarillo'
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: "reward-1",
    name: "Calculadora Científica Avanzada Casio FX-991 LA X",
    description: "Calculadora reglamentaria indispensable para exámenes parciales y finales de Ingeniería.",
    pointsCost: 200,
    originalStock: 15,
    availableStock: 12,
    imageIcon: "Calculator",
    category: "calculadora"
  },
  {
    id: "reward-2",
    name: "Texto Guía: Cálculo Trascendentes Tempranas (Stewart)",
    description: "El libro guía oficial para Cálculo I y Cálculo II. En perfectas condiciones.",
    pointsCost: 150,
    originalStock: 20,
    availableStock: 14,
    imageIcon: "BookOpen",
    category: "libro"
  },
  {
    id: "reward-3",
    name: "Física para Ciencias e Ingeniería Vol 1 (Serway)",
    description: "Excelente soporte bibliográfico para Física General y Mecánica. Incluye solucionario analítico.",
    pointsCost: 150,
    originalStock: 15,
    availableStock: 9,
    imageIcon: "BookOpen",
    category: "libro"
  },
  {
    id: "reward-4",
    name: "Cuaderno de Fórmulas y Apuntes Premium UDEP",
    description: "Formulario sintetizado y empastado, creado por los mejores mentores del curso.",
    pointsCost: 50,
    originalStock: 50,
    availableStock: 42,
    imageIcon: "BookMarked",
    category: "accesorio"
  }
];

export const INITIAL_RESOURCES: SharedResource[] = [
  {
    id: "res-1",
    title: "Resolución de Integrales por Partes - Paso a Paso",
    courseName: CourseName.CalculoI,
    type: "video",
    duration: "4:45",
    url: "https://drive.google.com/drive/folders/redsab-calculo-video1",
    description: "Video tutorial resolviendo 3 preguntas clásicas del examen parcial de Cálculo I.",
    authorName: "Dany Joel Farfán",
    downloadsOrViews: 128
  },
  {
    id: "res-2",
    title: "Vectores en R3 e Independencia Lineal en Exámenes",
    courseName: CourseName.AlgebraLineal,
    type: "video",
    duration: "5:00",
    url: "https://drive.google.com/drive/folders/redsab-algebra-video2",
    description: "Tips rápidos de 5 minutos sobre cómo resolver matrices con parámetros sin pifiar los signos.",
    authorName: "Dany Joel Farfán",
    downloadsOrViews: 94
  },
  {
    id: "res-3",
    title: "Banco de Prácticas Calificadas resueltas (2022 - 2025)",
    courseName: CourseName.CalculoI,
    type: "pdf",
    url: "https://drive.google.com/drive/folders/redsab-calculo-banco",
    description: "Recopilación PDF y digitalización oficial de exámenes anteriores con solucionario aprobado por cátedra.",
    authorName: "Gretta Lucía Cabrera",
    downloadsOrViews: 310
  },
  {
    id: "res-4",
    title: "Dinámica y Leyes de Newton - Resumen de Fórmulas",
    courseName: CourseName.FisicaGeneral,
    type: "pdf",
    url: "https://drive.google.com/drive/folders/redsab-fisica-resumen",
    description: "Cheat-sheet visual para tener claras las equivalencias de unidades y DCL (Diagramas de Cuerpo Libre).",
    authorName: "Evelyn Nicol Zapata",
    downloadsOrViews: 175
  }
];

export const INITIAL_TUTORSHIPS: TutorshipRequest[] = [
  {
    id: "tut-1",
    menteeId: "becado-1",
    menteeName: "Juan Manuel Ortiz Ruiz",
    courseName: CourseName.CalculoI,
    topic: "Teorema de Rolle y Valor Medio en derivadas",
    status: "programado",
    requestedDate: "2026-06-16T10:00:00-05:00",
    scheduledDate: "2026-06-19",
    scheduledTime: "15:00",
    mentorId: "mentor-2",
    mentorName: "Dany Joel Farfán Moscol"
  },
  {
    id: "tut-2",
    menteeId: "becado-2",
    menteeName: "Milagros Sofía Chunga Paz",
    courseName: CourseName.AlgebraLineal,
    topic: "Espacios vectoriales y subespacios",
    status: "pendiente",
    requestedDate: "2026-06-18T08:30:00-05:00"
  },
  {
    id: "tut-3",
    menteeId: "becado-1",
    menteeName: "Juan Manuel Ortiz Ruiz",
    courseName: CourseName.FisicaGeneral,
    topic: "Equilibrio estático y torques",
    status: "completado",
    requestedDate: "2026-06-14T09:00:00-05:00",
    scheduledDate: "2026-06-15",
    scheduledTime: "11:00",
    mentorId: "mentor-4",
    mentorName: "Evelyn Nicol Zapata Lachira",
    sessionNotes: "Juan entendió muy bien el concepto de momento de fuerza una vez que lo dibujamos juntos. Practicamos con 3 ejercicios del Serway. Recomiendo que practique más álgebra.",
    durationMinutes: 60,
    ratingByMentee: 5
  },
  {
    id: "tut-4",
    menteeId: "becado-3",
    menteeName: "Mateo Josué Flores Castillo",
    courseName: CourseName.CalculoI,
    topic: "Optimización de funciones",
    status: "pendiente",
    requestedDate: "2026-06-18T10:15:00-05:00"
  }
];
