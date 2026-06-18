/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SharedResource, CourseName, Student } from '../types';
import { getResources, addSharedResource, incrementResourceCounter } from '../lib/storage';
import { 
  FolderOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  ArrowUpRight, 
  Download, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ResourceHubProps {
  currentStudent: Student;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({ currentStudent }) => {
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState<CourseName>(CourseName.CalculoI);
  const [type, setType] = useState<'video' | 'pdf'>('video');
  const [duration, setDuration] = useState('5:00');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('todos');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setResources(getResources());
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addSharedResource({
      title,
      courseName,
      type,
      duration: type === 'video' ? duration : undefined,
      url: url.trim() || "https://drive.google.com/drive/folders/redsab-public-file",
      description,
      authorName: currentStudent.name
    });

    setTitle('');
    setDescription('');
    setUrl('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    loadData();
  };

  const handleDownloadSimulate = (id: string, fileUrl: string) => {
    incrementResourceCounter(id);
    loadData();
    // Simulate redirection/tab
    window.open(fileUrl, '_blank');
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'todos' || res.courseName === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div id="resource-hub" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Listado y busqueda de materiales */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-udep-blue flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-udep-gold" />
                Hub de Recursos Libres (Google Drive PWA)
              </h3>
              <p className="text-xs text-slate-500">Materiales y grabaciones de exámenes anteriores optimizados para ahorro de datos.</p>
            </div>
            
            {/* Search and filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar material..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-udep-sky"
                />
              </div>

              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="todos">Todos los cursos</option>
                {Object.values(CourseName).map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards List of Shared Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map(res => (
              <div key={res.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-udep-sky bg-blue-50 border border-blue-50 px-2 py-0.5 rounded">
                      {res.courseName}
                    </span>
                    {res.type === 'video' ? (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-100">
                        <Video className="h-3 w-3 text-red-500" /> {res.duration || '05:00'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-100">
                        <FileText className="h-3 w-3 text-blue-500" /> PDF
                      </span>
                    )}
                  </div>

                  <h4 className="font-semibold text-sm text-slate-800 mt-2.5 leading-tight">{res.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-snug">{res.description}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-3 mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Subido por: <strong className="text-slate-600">{res.authorName}</strong></p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{res.downloadsOrViews} visitas/descargas</p>
                  </div>

                  <button 
                    onClick={() => handleDownloadSimulate(res.id, res.url)}
                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-udep-blue font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Descargar
                  </button>
                </div>
              </div>
            ))}

            {filteredResources.length === 0 && (
              <div className="col-span-full text-center py-10">
                <FolderOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No se encontraron materiales que coincidan con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subir Material (Solo visible o habilitado para Mentores o Admin) */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
            <Plus className="h-5 w-5 text-udep-gold" />
            <div>
              <h3 className="font-display font-bold text-base text-udep-blue">Compartir Nuevo Material</h3>
              <p className="text-[11px] text-slate-400">Aportar guías, videos de 5 minutos o exámenes pasados.</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-normal">
            Los materiales quedan abiertos sobre Google Drive institucional y libre de consumo de datos móviles para todos los cachimbos. Por favor, asegúrate de que esté aprobado por el docente antes de subirlo.
          </p>

          {success ? (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-xs leading-normal flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span><strong>¡Material publicado!</strong> Ya está disponible en la biblioteca abierta de REDSAB. Se otorgarán puntos de mérito por aportes.</span>
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Título del Documento o Video:</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Formulario de Derivadas notables Cálculo I"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Curso Correspondiente:</label>
                <select 
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value as CourseName)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                >
                  {Object.values(CourseName).map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo de Archivo:</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as 'video' | 'pdf')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="video">Videotutorial (mp4)</option>
                    <option value="pdf">Documento (pdf)</option>
                  </select>
                </div>

                {type === 'video' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Duración (Ej: "4:15"):</label>
                    <input 
                      type="text" 
                      placeholder="5:00"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Enlace a Google Drive o Video:</label>
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Breve Descripción (Temas que aborda):</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej: Resuelve las 3 preguntas clave del Examen Parcial de 2024 para Física General sobre diagramas de fuerzas en poleas."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-udep-blue hover:bg-udep-sky text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
              >
                Publicar en Biblioteca <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
