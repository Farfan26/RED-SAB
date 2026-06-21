import { Course, Student, Mentor, LessonCapsule, LoanItem, LoanRequest, BudgetCategory, AcademicRisk } from './types';

export const INITIAL_COURSES: Course[] = [
  { id: 'calc-1', name: 'Cálculo I', code: 'MAT-101', category: 'Ciencias Básicas' },
  { id: 'alg-lin', name: 'Álgebra Lineal', code: 'MAT-102', category: 'Ciencias Básicas' },
  { id: 'fisc-1', name: 'Física I', code: 'FIS-101', category: 'Ciencias Básicas' },
  { id: 'met-est', name: 'Metodología de Estudio', code: 'MET-101', category: 'Metodología' },
  { id: 'intro-ing', name: 'Introducción a la Ingeniería', code: 'ING-101', category: 'Otros' }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'b-101',
    name: 'Kevin Alexander Quispe',
    email: 'kevin.quispe@alumnos.udep.edu.pe',
    carrera: 'Ingeniería Industrial y de Sistemas',
    ciclo: 1,
    promedio: 10.2,
    grades: {
      'calc-1': [11, 9, 8], // en alerta
      'alg-lin': [13, 11, 10],
      'fisc-1': [10, 8, 9]
    },
    risk: AcademicRisk.High,
    mentorId: 'm-201',
    ecopuntos: 120,
    streak: 3
  },
  {
    id: 'b-102',
    name: 'Valeria Sofía Mendoza',
    email: 'valeria.mendoza@alumnos.udep.edu.pe',
    carrera: 'Administración de Empresas',
    ciclo: 2,
    promedio: 12.8,
    grades: {
      'calc-1': [12, 14, 11],
      'met-est': [15, 14],
      'intro-ing': [13, 12]
    },
    risk: AcademicRisk.Medium,
    mentorId: 'm-202',
    ecopuntos: 250,
    streak: 5
  },
  {
    id: 'b-103',
    name: 'Diego Alonso Huamán',
    email: 'diego.huaman@alumnos.udep.edu.pe',
    carrera: 'Ingeniería Civil',
    ciclo: 1,
    promedio: 15.1,
    grades: {
      'calc-1': [16, 15, 14],
      'alg-lin': [14, 16],
      'fisc-1': [15, 15]
    },
    risk: AcademicRisk.Low,
    mentorId: 'm-201',
    ecopuntos: 410,
    streak: 12
  },
  {
    id: 'b-104',
    name: 'Estrella Marina Castro',
    email: 'estrella.castro@alumnos.udep.edu.pe',
    carrera: 'Arquitectura',
    ciclo: 1,
    promedio: 9.8,
    grades: {
      'calc-1': [8, 10, 9], // en alto riesgo
      'met-est': [12, 11]
    },
    risk: AcademicRisk.High,
    mentorId: undefined, // needs match!
    ecopuntos: 50,
    streak: 1
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm-201',
    name: 'Sofía Lorena Benites',
    email: 'sofia.benites@alumnos.udep.edu.pe',
    carrera: 'Ingeniería Industrial y de Sistemas',
    ciclo: 8,
    maxMentees: 4,
    menteeIds: ['b-101', 'b-103'],
    horasVoluntariado: 32,
    especialidades: ['Cálculo I', 'Álgebra Lineal', 'Física I']
  },
  {
    id: 'm-202',
    name: 'Andrés Marcelo Vilela',
    email: 'andres.vilela@alumnos.udep.edu.pe',
    carrera: 'Economía y Finanzas',
    ciclo: 7,
    maxMentees: 4,
    menteeIds: ['b-102'],
    horasVoluntariado: 24,
    especialidades: ['Cálculo I', 'Metodología de Estudio']
  },
  {
    id: 'm-203',
    name: 'Milagros Esther Paz',
    email: 'milagros.paz@alumnos.udep.edu.pe',
    carrera: 'Ingeniería Mecánico-Eléctrica',
    ciclo: 9,
    maxMentees: 4,
    menteeIds: [],
    horasVoluntariado: 40,
    especialidades: ['Física I', 'Álgebra Lineal']
  }
];

export const INITIAL_CAPSULES: LessonCapsule[] = [
  {
    id: 'cap-1',
    title: 'Límites Especiales y Funciones Reales',
    courseId: 'calc-1',
    courseName: 'Cálculo I',
    duration: '4:15',
    description: 'Aprende los teoremas clave para resolver límites trigonométricos especiales como sen(x)/x con destreza e intuición.',
    videoUrlMock: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Media',
    quiz: {
      question: '¿Cuál es el valor del límite de sen(3x) / x cuando x tiende a 0?',
      options: ['1', '3', '0', 'No existe'],
      correctIndex: 1,
      explanation: 'Utilizando la propiedad elemental lím_{u→0} sen(u)/u = 1, si multiplicamos y dividimos por 3, obtenemos 3 * [sen(3x)/(3x)], lo que resulta en 3.'
    }
  },
  {
    id: 'cap-2',
    title: 'Multiplicación de Matrices y Determinantes',
    courseId: 'alg-lin',
    courseName: 'Álgebra Lineal',
    duration: '3:50',
    description: 'Derriba el mito de la complejidad. Explicación directa del método de renglón-columna y cómo interpretar la determinante geométricamente.',
    videoUrlMock: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Fácil',
    quiz: {
      question: 'Si una matriz cuadrada tiene una determinante igual a cero, significa que:',
      options: ['Es una matriz identidad', 'Tiene inversa única', 'Es singular (no tiene matriz inversa)', 'Su transpuesta es nula'],
      correctIndex: 2,
      explanation: 'Una determinante de cero indica que los vectores fila/columna de la matriz son linealmente dependientes, por ende el mapeo colapsa las dimensiones y carece de matriz inversa.'
    }
  },
  {
    id: 'cap-3',
    title: 'Análisis de Fuerzas: Diagrama de Cuerpo Libre',
    courseId: 'fisc-1',
    courseName: 'Física I',
    duration: '4:40',
    description: 'Estrategia de 3 pasos de REDSAB para plantear ecuaciones de Newton sin confundir signos ni componentes vectoriales.',
    videoUrlMock: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Media',
    quiz: {
      question: 'En un plano inclinado con rozamiento, la fuerza normal siempre es:',
      options: ['Igual al peso del cuerpo (m*g)', 'Igual a m * g * cos(θ)', 'Igual a m * g * sen(θ)', 'Cero'],
      correctIndex: 1,
      explanation: 'En el eje perpendicular al plano inclinado (donde no hay aceleración), la sumatoria de fuerzas nos da Normal = Componente del Peso perpendicular al plano = m * g * cos(θ).'
    }
  },
  {
    id: 'cap-4',
    title: 'Método Pomodoro Adaptado a la Universidad',
    courseId: 'met-est',
    courseName: 'Metodología de Estudio',
    duration: '3:05',
    description: 'Cómo dividir bloques de estudio para cursos con alta demanda matemática para evitar la fatiga cognitiva y el síndrome del impostor.',
    videoUrlMock: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
    difficulty: 'Fácil',
    quiz: {
      question: '¿Cuál es la longitud ideal de descanso recomendada en Pomodoro tras 4 ciclos de estudio técnico?',
      options: ['5 minutos', '10 minutos', 'Entre 20 y 30 minutos', '1 hora'],
      correctIndex: 2,
      explanation: 'Para materias complejas de ciencias, el cerebro requiere un descanso prolongado (20-30 min) para consolidar los conceptos en la memoria de largo plazo y reducir el estrés.'
    }
  }
];

export const INITIAL_LOAN_ITEMS: LoanItem[] = [
  { id: 'item-calc-casio', name: 'Calculadora Científica Casio ClassWiz', type: 'Calculadora', serialOrTitle: 'FX-991LAX / CW', totalStock: 15, availableStock: 11, ecopuntosCost: 15 },
  { id: 'item-book-calc', name: 'Libro: Cálculo de Una Variable (Stewart - 7ma Ed)', type: 'Libro', serialOrTitle: 'ISBN-9786074817812', totalStock: 12, availableStock: 8, ecopuntosCost: 10 },
  { id: 'item-book-algebra', name: 'Libro: Álgebra Lineal y Aplicaciones (Lay - 5ta Ed)', type: 'Libro', serialOrTitle: 'ISBN-9786073235235', totalStock: 15, availableStock: 12, ecopuntosCost: 10 },
  { id: 'item-book-physics', name: 'Libro: Física para Ciencias e Ingeniería (Serway - Vol 1)', type: 'Libro', serialOrTitle: 'ISBN-9786074818291', totalStock: 13, availableStock: 9, ecopuntosCost: 10 }
];

export const INITIAL_LOAN_REQUESTS: LoanRequest[] = [
  {
    id: 'loan-1',
    itemId: 'item-calc-casio',
    itemName: 'Calculadora Científica Casio ClassWiz',
    itemType: 'Calculadora',
    studentId: 'b-101',
    studentName: 'Kevin Alexander Quispe',
    requestDate: '2026-06-15',
    dueDate: '2026-06-22',
    status: 'Prestado'
  },
  {
    id: 'loan-2',
    itemId: 'item-book-calc',
    itemName: 'Libro: Cálculo de Una Variable (Stewart - 7ma Ed)',
    itemType: 'Libro',
    studentId: 'b-102',
    studentName: 'Valeria Sofía Mendoza',
    requestDate: '2026-06-10',
    dueDate: '2026-06-17', // Late!
    status: 'Retrasado'
  }
];

export const BUDGET_BREAKDOWN: BudgetCategory[] = [
  {
    name: 'Hub Logístico y Calculadoras',
    amount: 1500,
    percentage: 30,
    color: '#0d4a85', // UDEP light blue
    description: 'Adquisición auditada de 15 calculadoras Casio ClassWiz y 40 textos guía de alta demanda para el banco de recursos físicos.'
  },
  {
    name: 'Infraestructura Cloud / TIC',
    amount: 1200,
    percentage: 24,
    color: '#002347', // UDEP main blue
    description: 'Gastos operativos de base de datos distribuidos, alojamiento optimizado en la nube para baja latencia/conectividad y PWA hosting.'
  },
  {
    name: 'Identidad UX/UI y Kits de Bienvenida',
    amount: 950,
    percentage: 19,
    color: '#f1b82d', // UDEP Gold
    description: 'Diseño accesible de interfaces, folletos informativos contra el estigma, y materiales listos para emparejamientos y dinámicas.'
  },
  {
    name: 'Hardware de Prod. Multimedia',
    amount: 850,
    percentage: 17,
    color: '#a78bfa',
    description: 'Accesorios de grabación y micrófonos para la ágil creación de las 60 cápsulas de microaprendizaje de menos de 5 minutos.'
  },
  {
    name: 'Fondo de Reserva Técnica',
    amount: 500,
    percentage: 10,
    color: '#64748b',
    description: 'Fondo de respuesta rápida para mantenimiento de hardware o renovación imprevista de materiales maltratados.'
  },
  {
    name: 'Desarrollo de Software PWA',
    amount: 0,
    percentage: 0,
    color: '#10b981',
    description: '¡Desarrollo In-House Costo Cero! Diseñado e implementado con orgullo por estudiantes de Ingeniería Industrial y de Sistemas.'
  }
];
