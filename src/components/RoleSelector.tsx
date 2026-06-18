/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, ShieldCheck, Award, GraduationCap } from 'lucide-react';
import { RoleType } from '../types';

interface RoleSelectorProps {
  currentRole: RoleType;
  selectedUserId: string;
  onRoleChange: (role: RoleType, userId: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  selectedUserId,
  onRoleChange
}) => {
  return (
    <div id="role-selector-bar" class="bg-gradient-to-r from-udep-blue to-udep-sky text-white py-3 px-4 shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-udep-gold" />
          </div>
          <div>
            <h1 class="font-display font-bold text-lg tracking-tight">REDSAB Digital</h1>
            <p class="text-xs text-white/85">Soporte Académico para Becados - Universidad de Piura</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-white/70 font-semibold uppercase tracking-wider mr-1">Simular Vista:</span>
          
          <button
            id="role-btn-becado"
            onClick={() => onRoleChange('becado', 'becado-1')}
            className={`flex items-center gap-2 px-3  py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'becado'
                ? 'bg-white text-udep-blue shadow-sm font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Becado: Juan Manuel (Cachimbo)
          </button>

          <button
            id="role-btn-mentor"
            onClick={() => onRoleChange('mentor', 'mentor-2')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'mentor'
                ? 'bg-white text-udep-blue shadow-sm font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Mentor: Dany Joel (Ciclo 9)
          </button>

          <button
            id="role-btn-admin"
            onClick={() => onRoleChange('bienestar', 'admin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentRole === 'bienestar'
                ? 'bg-white text-udep-blue shadow-sm font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Bienestar Universitario
          </button>
        </div>
      </div>
    </div>
  );
};
