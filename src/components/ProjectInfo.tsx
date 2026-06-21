import React, { useState } from 'react';
import { BookOpen, Users, ShieldAlert, Award, Grid, ListCollapse, BarChart3, AlertCircle } from 'lucide-react';

export default function ProjectInfo() {
  const [theoryTab, setTheoryTab] = useState<'causas' | 'ecosistema' | 'marco'>('causas');

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200 space-y-6" id="project-info">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-extrabold text-udep-blue-dark flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-udep-blue-light" />
          Bases Académicas y Marco Teórico del Proyecto
        </h2>
        <p className="text-xs text-slate-505 font-sans mt-1">Diagnóstico profundo y formulación del Grupo 1 para la Universidad de Piura (UDEP)</p>
      </div>

      {/* Mini tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm text-xs">
        <button
          id="btn-theory-causas"
          onClick={() => setTheoryTab('causas')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
            theoryTab === 'causas'
              ? 'bg-white text-udep-blue-dark shadow-sm'
              : 'text-slate-550 hover:text-slate-800'
          }`}
        >
          Causas Raíz
        </button>
        <button
          id="btn-theory-ecosistema"
          onClick={() => setTheoryTab('ecosistema')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
            theoryTab === 'ecosistema'
              ? 'bg-white text-udep-blue-dark shadow-sm'
              : 'text-slate-550 hover:text-slate-800'
          }`}
        >
          Mapeo Ecosistema
        </button>
        <button
          id="btn-theory-marco"
          onClick={() => setTheoryTab('marco')}
          className={`flex-1 py-2 text-center rounded-lg font-bold transition-all ${
            theoryTab === 'marco'
              ? 'bg-white text-udep-blue-dark shadow-sm'
              : 'text-slate-550 hover:text-slate-800'
          }`}
        >
          Marco Lógico (VIO)
        </button>
      </div>

      {/* TAB CONTENT: Causas Raíz (Slide 3) */}
      {theoryTab === 'causas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="theory-causas-panel">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-3 relative overflow-hidden">
            <div className="w-1.5 h-full bg-rose-500 absolute top-0 left-0"></div>
            <div className="p-2 w-9 h-9 rounded-lg bg-rose-50 text-rose-600 font-bold font-mono text-center text-xs">1</div>
            <h4 className="font-extrabold text-slate-800 text-sm">Académica-Estructural</h4>
            <p className="text-xxs text-slate-550 leading-relaxed font-sans">
              Marcada asimetría en competencias cuantitativas (ciencias básicas como Cálculo I u Álgebra lineal) derivadas de colegios públicos de procedencia, sumado al desconocimiento de metodologías de autoaprendizaje de nivel universitario.
            </p>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-3 relative overflow-hidden">
            <div className="w-1.5 h-full bg-amber-500 absolute top-0 left-0"></div>
            <div className="p-2 w-9 h-9 rounded-lg bg-amber-50 text-amber-600 font-bold font-mono text-center text-xs">2</div>
            <h4 className="font-extrabold text-slate-800 text-sm">Medio Psicosocial Errado</h4>
            <p className="text-xxs text-slate-550 leading-relaxed font-sans">
              Ausencia de un ecosistema horizontal que amortigüe el choque cultural. El aislamiento social bloquea la integración en grupos de estudio orgánicos por diferencias marcadas de capital socioeconómico, redundando en el síndrome del impostor.
            </p>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-150 space-y-3 relative overflow-hidden">
            <div className="w-1.5 h-full bg-sky-500 absolute top-0 left-0"></div>
            <div className="p-2 w-9 h-9 rounded-lg bg-sky-50 text-sky-600 font-bold font-mono text-center text-xs">3</div>
            <h4 className="font-extrabold text-slate-800 text-sm">Barreras Logísticas</h4>
            <p className="text-xxs text-slate-550 leading-relaxed font-sans">
              Limitaciones económicas críticas para la adquisición de herramientas de soporte técnico avanzado (calculadoras científicas Casio homologadas), textos guía complementarios de alta demanda económica y materiales especializados.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Mapeo Ecosistema (Slide 4) */}
      {theoryTab === 'ecosistema' && (
        <div className="overflow-x-auto border rounded-2xl" id="theory-ecosistema-panel">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-650 font-bold">
                <th className="p-4">Grupo Involucrado</th>
                <th className="p-4">Intereses en el Proyecto</th>
                <th className="p-4">Problemas Percibidos (Línea Base)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              <tr>
                <td className="p-4 font-bold text-slate-800">Alumnos Becados (Primeros Ciclos)</td>
                <td className="p-4 text-slate-600">Mantener el promedio institucional para retener la beca. Inserción social libre de estigmatización y discriminación.</td>
                <td className="p-4 text-slate-500 italic">Insuficiencia de bases escolares. Altos índices de estrés, ansiedad, síndrome del impostor y resistencia a canales formales verticales.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">Alumnos Mentores (Ciclos Superiores)</td>
                <td className="p-4 text-slate-600">Consolidar conocimientos técnicos y blandos prácticos. Convalidar horas de voluntariado obligatorias para egreso.</td>
                <td className="p-4 text-slate-500 italic">Inexistencia de un canal formalizado y riesgo de mala gestión horaria sin soporte logístico.</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">Oficina de Bienestar Universitario</td>
                <td className="p-4 text-slate-600">Reducir drásticamente las tasas de deserción. Asegurar el bienestar sicológico integral de los becarios.</td>
                <td className="p-4 text-slate-500 italic">Escasez de personal para atención masiva. Detección tardía de vulnerabilidad (a final de ciclo, sin margen de corrección).</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-800">Cuerpo Docente de la UDEP</td>
                <td className="p-4 text-slate-600">Preservar el rigor y exigencias académicas históricas de la UDEP. Optimizar el tiempo de asesoría ordinaria.</td>
                <td className="p-4 text-slate-500 italic">Imposibilidad material de detener el sílabo para subsanar vacíos profundos de educación básica pública.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Marco Lógico (Slide 8) */}
      {theoryTab === 'marco' && (
        <div className="space-y-4" id="theory-marco-panel">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 block uppercase font-mono text-[9px] tracking-wide mb-2 text-indigo-700">📌 FIN (Impacto Esperado):</span>
            <p className="text-xxs text-slate-600 leading-normal">
              Contribuir a la movilidad social y disminución de la deserción mediante la transformación digital horizontal, asegurando el egreso de profesionales vulnerables de la UDEP. <strong className="text-slate-800">Incremento del 25% en la tasa histórica de titulación oportuna a 5 años.</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 block uppercase font-mono text-[9px] tracking-wide mb-2 text-amber-700">📌 PROPÓSITO (Efecto Inmediato):</span>
            <p className="text-xxs text-slate-600 leading-normal">
              Validar una PWA de soporte y monitoreo predictivo que optimice la nivelación acelerada, eleve promedios ponderados y consolide la adaptación sociocultural. <strong className="text-slate-800">98% retiene condición de beca y 100% de casos críticos "Rojo" atendidos en menos de 24 horas.</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs">
            <span className="font-bold text-slate-700 block uppercase font-mono text-[9px] tracking-wide mb-2 text-emerald-700">📌 COMPONENTES (Entregables Auditados):</span>
            <p className="text-xxs text-slate-600 leading-normal">
              C1: MVP PWA desplegado para baja conectividad. C2: Algoritmo de Emparejamiento 1:4 y Dashboard automatizados. C3: 60 cápsulas de aprendizaje, banco auditado de 15 calculadoras Casio y 40 textos guía gamificados.
            </p>
          </div>
        </div>
      )}

      {/* References Footer */}
      <div className="border-t border-slate-150 pt-4 text-xxs text-slate-400 font-mono flex flex-col md:flex-row justify-between items-start gap-2">
        <span>© Grupo 1 - Formulación RED SAB UDEP IPD-2026-I</span>
        <div className="space-x-4">
          <span>Tinto, V. (2015) - Harvard Educational Review</span>
          <span>CEPAL (2018) - Enfoque de Marco Lógico</span>
        </div>
      </div>

    </div>
  );
}
