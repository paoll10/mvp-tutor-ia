'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center font-display p-4 lg:p-8 transition-colors duration-300 bg-background-light dark:bg-background-dark">
      <div className="w-full max-w-[1100px] h-auto lg:h-[720px] bg-white dark:bg-surface-dark rounded-2xl shadow-soft flex flex-col lg:flex-row overflow-hidden border border-gray-100 dark:border-gray-800 relative group/design-root">
        <div className="lg:w-5/12 w-full bg-[#f0f9f8] dark:bg-[#151e2d] relative flex flex-col justify-between p-8 lg:p-12 overflow-hidden order-1 lg:order-none min-h-[300px] lg:min-h-full">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-[100%] h-[60%] bg-[#ffd6a5]/20 rounded-full blur-[90px]"></div>
          
          <div className="relative z-10 flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-slate-800 dark:text-white">EduPath</span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Desbloqueie seu <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5eead4] to-[#93c5fd]">potencial</span> hoje.
            </h2>
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-white/5 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
              <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105" data-alt="A group of diverse students laughing and studying together in a sunny library" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8OSVY4DMxwhiDjAzC1gpDvuHrYTjVg58cjBy_3XDPqoGRkHPcuJE9hwb9KkNdamudJYZ1-QhEOTEHVXkOAqRZmT5I0Ng2nmeMpaIS45u4J489vyGJSjtAD7I2OiTTp-FAUBQ3kJLvi90FoOChxAE5SMYd0uynpyGOaY2YB95pZjZ4P_So2ihq6a_WZoKsbDdlj1cD1gUk8FJxm9UDN3J0X309c2HwCmReVEAQD5gUEw-lNkmPYRT2sSVrMOmKd_PpM0QZEqdH3JE")' }}></div>
              <div className="absolute bottom-4 left-4 z-20">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <span className="material-symbols-outlined text-green-600 text-[16px]">check_circle</span>
                  <span className="text-xs font-bold text-slate-800">Mentor Verificado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">"As funcionalidades de IA me ajudaram a organizar meu cronograma de estudos em minutos!"</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold">— Sarah K., Estudante de Biologia</p>
          </div>
        </div>

        <div className="lg:w-7/12 w-full bg-white dark:bg-surface-dark flex flex-col relative order-2 lg:order-none">
          <div className="pt-8 px-8 lg:px-12 pb-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium opacity-0 cursor-default">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Voltar
              </button>
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600"></span>
              </div>
              <button className="text-slate-400 hover:text-red-500 transition-colors text-sm font-medium">
                Pular
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <p className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider">Passo 1 de 3</p>
                <p className="text-primary text-xs font-bold">Definição de Metas</p>
              </div>
              <div className="rounded-full bg-slate-100 dark:bg-slate-700 h-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-primary shadow-glow w-[33%]"></div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-2">
            <div className="mb-8">
              <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] lg:text-[40px] font-extrabold leading-[1.1] mb-3">
                Bem-vindo à sua <br/> jornada de aprendizado!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Vamos personalizar sua experiência. Qual é o seu foco principal hoje?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" defaultChecked />
                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 transition-all duration-300 peer-checked:shadow-md peer-checked:shadow-primary/10">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary flex items-center justify-center text-slate-900 shadow-sm">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-base">Melhorar Notas</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Foco em médias e notas</span>
                  </div>
                  <div className="absolute top-4 right-4 text-primary opacity-100 transition-opacity">
                    <span className="material-symbols-outlined filled">check_circle</span>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/5">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-base">Novas Habilidades</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Programação, Design, etc.</span>
                  </div>
                  <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined filled">check_circle</span>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/5">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-base">Preparação para Provas</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">ENEM, Vestibulares, Finais</span>
                  </div>
                  <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined filled">check_circle</span>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group relative">
                <input className="peer sr-only" type="checkbox" />
                <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/5">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined">explore</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-base">Apenas Curioso</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Explorar interesses</span>
                  </div>
                  <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined filled">check_circle</span>
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group relative sm:col-span-2">
                <input className="peer sr-only" type="checkbox" />
                <div className="flex items-center gap-4 p-5 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 peer-checked:border-primary peer-checked:bg-primary/5">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-900 dark:text-white font-bold text-base">Crescimento na Carreira</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Habilidades profissionais e networking</span>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined filled">check_circle</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="p-8 lg:px-12 lg:py-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-surface-dark z-20">
            <div className="hidden sm:flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">info</span>
              <span className="text-xs text-slate-400 font-medium">Leva menos de 2 min</span>
            </div>
            <button className="w-full sm:w-auto bg-primary hover:bg-[#8eeed3] text-slate-900 px-10 py-4 rounded-full font-bold text-base transition-all transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
              Próximo Passo
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>

          <div className="absolute bottom-28 right-8 z-30 hidden lg:flex flex-col items-end pointer-events-none">
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl rounded-br-sm shadow-xl mb-3 max-w-[200px] pointer-events-auto">
              <p className="text-xs font-semibold leading-relaxed">
                Olá! Sou seu mentor IA. Vou te ajudar a escolher cursos em breve! 👋
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary border-2 border-white dark:border-slate-700 shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-slate-900 text-[20px]">smart_toy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

