"use client"

import { Button } from "@/components/ui/button"
import { m, LazyMotion, domAnimation } from "framer-motion"
import { ArrowRight, User, Briefcase } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: "employee" | "manager") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#FaFaFa] overflow-hidden">

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-6xl z-10 grid md:grid-cols-2 gap-16 items-center">

          {/* Left Side: Text & Intro */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-sm border border-slate-200/50 text-slate-500 rounded-full text-xs font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-primary/60"></span>
              Sistema Corporativo
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-slate-800 tracking-tight leading-[1.1]">
              Work mindfully, <br />
              <span className="text-primary italic">Achieve effortlessly.</span>
            </h1>

            <p className="text-xl text-slate-500 font-light max-w-lg leading-relaxed font-sans">
              Plataforma centralizada para solicitudes, aprobaciones y control de balance de vida laboral.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 flex items-center gap-2 text-sm text-slate-600 shadow-sm">
                <span className="text-primary">✨</span> Gestión Rápida
              </div>
              <div className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 flex items-center gap-2 text-sm text-slate-600 shadow-sm">
                <span className="text-primary">🛡️</span> Datos Seguros
              </div>
            </div>
          </m.div>

          {/* Right Side: Login Cards */}
          <div className="flex flex-col gap-6 relative">
            <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-full blur-3xl -z-10" />

            {/* Employee Card */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onLogin("employee")}
              >
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-medium text-slate-800 mb-1">Colaborador</h3>
                    <p className="text-sm text-slate-500 font-sans">Acceso personal para gestión de solicitudes.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </m.div>

            {/* Manager Card */}
            <m.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => onLogin("manager")}
              >
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-medium text-slate-800 mb-1">Gerencia</h3>
                    <p className="text-sm text-slate-500 font-sans">Panel administrativo y auditoría.</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-teal-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </m.div>

          </div>
        </div>

        <div className="absolute bottom-8 text-center w-full text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          Enterprise System &copy; 2025
        </div>

      </div>
    </LazyMotion>
  )
}
