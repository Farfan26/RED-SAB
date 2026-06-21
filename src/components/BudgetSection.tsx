import React, { useState } from 'react';
import { BUDGET_BREAKDOWN } from '../data';
import { Calculator, Sparkles, Landmark, Settings, AlertCircle, CheckCircle } from 'lucide-react';

export default function BudgetSection() {
  const [calculatorCount, setCalculatorCount] = useState<number>(15);
  const [reserveFundUsed, setReserveFundUsed] = useState<number>(0);

  // Constants
  const baseCalculatorCost = 100; // S/. 100 per Casio ClassWiz
  const budgetCap = 5000;

  // Calculate dynamic totals
  const totalCalculatorExpense = calculatorCount * baseCalculatorCost;
  const remainingLogistics = 1500 - (15 * baseCalculatorCost); // remaining of initial S/. 1500 hub allocation
  
  // Dynamic logistics total
  const dynamicLogisticsExpense = totalCalculatorExpense + remainingLogistics;

  // Let's compute other slides' values
  const cloudTICExpense = 1200;
  const designKitExpense = 950;
  const videoHardwareExpense = 850;
  const baseReserve = 500;
  const dynamicReserveExpense = Math.max(0, baseReserve - reserveFundUsed);

  // Combined Total
  const currentTotal = dynamicLogisticsExpense + cloudTICExpense + designKitExpense + videoHardwareExpense + dynamicReserveExpense;

  return (
    <div className="bg-slate-55 rounded-2xl p-4 md:p-6 space-y-6" id="budget-section">
      
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-udep-blue-dark flex items-center gap-2">
            <Landmark className="h-6 w-6 text-udep-yellow-dark" />
            Presupuesto de Inversión y Sostenibilidad (S/. 5,000)
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">Estructura financiera eficiente para el soporte de becados UDEP - Periodo Piloto 2026</p>
        </div>
        <div className="bg-udep-yellow/15 text-udep-blue-dark font-sans font-extrabold text-xs px-3.5 py-1.5 rounded-lg border border-udep-yellow/30 font-mono">
          Total Proyecto: S/. 5,000 PEN
        </div>
      </div>

      {/* Grid: 2 Columns (Investment structure list + Interactive simulation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category breakdown (Visualized & itemized) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xxs font-bold text-slate-400 block font-mono">DESGLOSE DEL PRESUPUESTO ORIGINAL (DIAGRAMA DE TORTA DE SLIDE 9)</span>
          
          <div className="space-y-3">
            {BUDGET_BREAKDOWN.map(cat => (
              <div 
                key={cat.name} 
                className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Visual Color Dot */}
                  <span 
                    className="w-3.5 h-3.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      {cat.name} 
                      {cat.amount === 0 && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[9px] font-mono">
                          Orgullo UDEP
                        </span>
                      )}
                    </h4>
                    <p className="text-xxs text-slate-505 leading-relaxed mt-1">{cat.description}</p>
                  </div>
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <span className="text-xs font-mono font-black text-slate-800 block">S/. {cat.amount.toLocaleString()}</span>
                  <span className="text-xxs text-slate-400 font-mono font-medium block">
                    {cat.percentage > 0 ? `${cat.percentage}% del total` : 'Costo Cero / Alumnos'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive calculator sidebar */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* S/. 0.00 explanation slide banner */}
          <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100/30 rounded-full translate-x-4 -translate-y-4"></div>
            <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-bounce" />
              Sostenibilidad: Desarrollo In-House de Software
            </h4>
            <p className="text-xxs text-emerald-850 leading-relaxed mt-1.5">
              A diferencia de consultorías externas costosas (Alternativa A Descartada: S/. 15,000 - S/. 20,000), el MVP de la PWA es desarrollado íntegramente por alumnos avanzados de <strong>Ingeniería Industrial y de Sistemas</strong> de la UDEP como parte de sus horas pre-profesionales/voluntariado. Esto habilita <strong>costos de desarrollo de S/. 0.00</strong>, maximizando el fondo para equipamiento físico directo de los becarios vulnerables.
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-udep-blue-light" />
              Simulador Técnico de Rendimiento de Fondos
            </h4>
            
            <p className="text-xxs text-slate-500 font-sans leading-normal">
              Simule la expansión del banco físico del <strong>Hub Logístico</strong> aumentando la cantidad de Calculadoras Científicas Casio ClassWiz (FX- LAX) para el préstamo de becarios:
            </p>

            {/* Slider count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600 font-mono">Calculadoras Casio fx-991:</span>
                <span className="font-bold text-udep-blue-light font-mono">{calculatorCount} unidades</span>
              </div>
              <input
                id="calculator-range"
                type="range"
                min="5"
                max="35"
                value={calculatorCount}
                onChange={(e) => setCalculatorCount(Number(e.target.value))}
                className="w-full bg-slate-100 h-2 rounded-lg appearance-none cursor-pointer accent-udep-blue-light"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Mín: 5 uds</span>
                <span>Base: 15 uds (Stewart)</span>
                <span>Máx: 35 uds</span>
              </div>
            </div>

            {/* Simulated Expense summary */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-sans">Gasto en Calculadoras (S/. 100/u):</span>
                <span className="font-mono font-bold text-slate-700">S/. {totalCalculatorExpense}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-sans">Alojamiento Cloud / TIC (Fijo):</span>
                <span className="font-mono font-bold text-slate-700">S/. {cloudTICExpense}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-sans">Multimedia y Kits (Fijo):</span>
                <span className="font-mono font-bold text-slate-700">S/. {1800}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-sans font-medium">Fondo Reserva restante:</span>
                <span className="font-mono font-bold text-amber-600">S/. {dynamicReserveExpense}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Presupuesto Simulado:</span>
                <span className={`font-mono text-sm ${currentTotal <= budgetCap ? 'text-emerald-700' : 'text-rose-600'}`}>
                  S/. {currentTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Over-budget warning */}
            {currentTotal > budgetCap ? (
              <div className="p-3 bg-rose-50 border border-rose-150 text-rose-800 rounded-xl text-xxs flex items-start gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>¡Alerta de Techo de Inversión!</strong> Has excedido los S/. 5,000 del límite presupuestado del grupo. Considera recortar hardware de grabación o apalancarte de la reserva técnica.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xxs flex items-start gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Presupuesto Viable</strong>. El fondo y el remanente de S/. {budgetCap - currentTotal} permite garantizar la sostenibilidad de la PWA durante el primer semestre del piloto.
                </span>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
