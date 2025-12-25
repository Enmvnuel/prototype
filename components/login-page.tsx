"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginPageProps {
  onLogin: (role: "employee" | "manager") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Sistema de Gestión de Licencias y Permisos</h1>
          <p className="text-xl text-slate-300">Seleccione su rol para acceder al sistema</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Employee Card */}
          <Card className="border-0 shadow-2xl hover:shadow-slate-600/50 hover:shadow-2xl transition-all cursor-pointer">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Acceso para Empleado</CardTitle>
              <CardDescription className="text-blue-100">Solicitar licencias y permisos</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-gray-600 mb-6">
                  Ver tu saldo de vacaciones, solicitar nuevas licencias y monitorear el estado de tus solicitudes.
                </p>
              </div>
              <Button
                onClick={() => onLogin("employee")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              >
                Acceder como Empleado
              </Button>
            </CardContent>
          </Card>

          {/* Manager Card */}
          <Card className="border-0 shadow-2xl hover:shadow-slate-600/50 hover:shadow-2xl transition-all cursor-pointer">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Acceso para Gerente</CardTitle>
              <CardDescription className="text-emerald-100">Aprobar y gestionar solicitudes</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👨‍💼</div>
                <p className="text-gray-600 mb-6">
                  Revisar y aprobar solicitudes de licencias de tu equipo, gestionar múltiples solicitudes y generar
                  reportes.
                </p>
              </div>
              <Button
                onClick={() => onLogin("manager")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
              >
                Acceder como Gerente
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>Sistema de Gestión de Licencias v1.0 | Demo</p>
        </div>
      </div>
    </div>
  )
}
