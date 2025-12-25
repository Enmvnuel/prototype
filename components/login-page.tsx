"use client"

import { Button } from "@/components/ui/button"
import { m, LazyMotion, domAnimation } from "framer-motion"

interface LoginPageProps {
  onLogin: (role: "employee" | "manager") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0e17] to-black flex items-center justify-center p-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500 blur-[128px]"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[128px]"
          />
        </div>

        <div className="w-full max-w-5xl z-10">
          <m.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight">
              Enterprise Access
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto">
              Portal unificado de gestión de talento y licencias corporativas.
            </p>
          </m.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
            {/* Employee Card */}
            <m.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-2xl hover:shadow-blue-900/20"
                onClick={() => onLogin("employee")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">👋</span>
                  </div>

                  <h3 className="text-3xl font-semibold text-white mb-3">Colaborador</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Gestiona tus vacaciones, solicita permisos y consulta tu balance de días disponibles en tiempo real.
                  </p>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-6 text-lg font-medium shadow-lg shadow-blue-900/20 transition-all border border-blue-400/20"
                  >
                    Ingresar al Portal
                  </Button>
                </div>
              </div>
            </m.div>

            {/* Manager Card */}
            <m.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-2xl hover:shadow-emerald-900/20"
                onClick={() => onLogin("manager")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">💼</span>
                  </div>

                  <h3 className="text-3xl font-semibold text-white mb-3">Gerencia</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Panel de control integral para aprobación de solicitudes, métricas de equipo y auditoría.
                  </p>

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-6 text-lg font-medium shadow-lg shadow-emerald-900/20 transition-all border border-emerald-400/20"
                  >
                    Acceso Administrativo
                  </Button>
                </div>
              </div>
            </m.div>
          </div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-slate-500 text-sm font-medium tracking-widest uppercase opacity-60">
              Enterprise Leave Management System &copy; 2025
            </p>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  )
}
