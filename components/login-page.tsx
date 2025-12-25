"use client"

import { Button } from "@/components/ui/button"
import { m, LazyMotion, domAnimation } from "framer-motion"

interface LoginPageProps {
  onLogin: (role: "employee" | "manager") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white">

        <div className="w-full max-w-5xl z-10 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side: Text & Intro */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 border border-blue-100">
              Sistema Corporativo
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Talento</span> y Licencias
            </h1>
            <p className="text-lg text-slate-500 font-light max-w-md leading-relaxed">
              Plataforma centralizada para solicitudes, aprobaciones y control de balance de vida laboral.
            </p>
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 font-medium tracking-widest uppercase">
              <span>Seguro</span> • <span>Rápido</span> • <span>Confiable</span>
            </div>
          </m.div>

          {/* Right Side: Login Cards */}
          <div className="flex flex-col gap-6">

            {/* Employee Card */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onLogin("employee")}
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-3xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                    👋
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">Colaborador</h3>
                    <p className="text-sm text-slate-500">Acceso personal para gestión de solicitudes.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </m.div>

            {/* Manager Card */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onLogin("manager")}
              >
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-3xl shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
                    💼
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">Gerencia</h3>
                    <p className="text-sm text-slate-500">Panel administrativo y auditoría.</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </m.div>

          </div>
        </div>

        <div className="absolute bottom-6 text-center w-full text-slate-400 text-xs font-medium tracking-wider">
          &copy; 2025 ENTERPRISE SYSTEM v1.2
        </div>

      </div>
    </LazyMotion>
  )
}
