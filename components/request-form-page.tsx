"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppContext } from "@/context/app-context"
import { ArrowLeft, LogOut, AlertCircle, UploadCloud, Calendar, MapPin, FileText } from "lucide-react"
import { m, LazyMotion, domAnimation } from "framer-motion"

interface RequestFormPageProps {
  onBack: () => void
  onLogout: () => void
}

export default function RequestFormPage({ onBack, onLogout }: RequestFormPageProps) {
  const { addRequest, getEmployeeBalance } = useAppContext()
  const [workSite, setWorkSite] = useState("")
  const [permissionType, setPermissionType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [observations, setObservations] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const balance = getEmployeeBalance("emp001")
  const employeeId = "emp001"
  const employeeName = "Nombre del Empleado"

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startD = new Date(start)
    const endD = new Date(end)
    const diffMs = endD.getTime() - startD.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
    return Math.max(0, diffDays)
  }

  const totalDays = calculateDays(startDate, endDate)

  // Calculate available balance based on current permission type
  // For types that don't track balance, we use null to prevent showing incorrect info
  const availableBalance =
    permissionType === "Vacaciones"
      ? balance.vacation
      : permissionType === "Compensatorio"
        ? balance.compensatory
        : null

  const hasError = availableBalance !== null && totalDays > availableBalance && totalDays > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!workSite || !permissionType || !startDate || !endDate) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    if (hasError && availableBalance !== null) {
      setError(`Los días solicitados exceden su saldo actual de ${availableBalance} días.`)
      return
    }

    // Create new request
    const newRequest = {
      id: `REQ${Math.floor(Math.random() * 10000).toString().padStart(3, "0")}`,
      employeeId,
      employeeName,
      type: permissionType as "Vacaciones" | "Licencia por Enfermedad" | "Compensatorio",
      startDate,
      endDate,
      totalDays,
      workSite,
      status: "PENDIENTE" as const,
      createdAt: new Date().toISOString().split("T")[0],
      observations,
      evidence: file ? true : false, // Fixed type
    }

    addRequest(newRequest)
    setSubmitted(true)
    // REMOVED TIMEOUT: Let user click "Volver" manually
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-2xl shadow-green-500/10 text-center overflow-hidden bg-white/80 backdrop-blur-xl">
              <CardContent className="pt-16 pb-12 space-y-8">
                <div className="relative">
                  <m.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-green-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-green-200"
                  >
                    <span className="text-5xl font-bold">✓</span>
                  </m.div>
                  <m.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full blur-2xl opacity-40"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">¡Solicitud Completada!</h2>
                  <p className="text-slate-500 mt-3 font-medium px-8 text-sm leading-relaxed">
                    Su solicitud de <span className="text-slate-900 font-bold">{permissionType}</span> por <span className="text-slate-900 font-bold">{totalDays} días</span> ha sido enviada correctamente.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="h-1.5 w-48 bg-slate-100 rounded-full mx-auto overflow-hidden">
                    <m.div
                      initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Registrando transacción...</p>
                </div>

                <div className="pt-4 px-8">
                  <Button
                    onClick={onBack}
                    className="w-full py-7 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Regresar al Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </LazyMotion>
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-2 hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="font-medium">Volver</span>
              </Button>
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
              <h1 className="text-lg font-bold text-slate-900 truncate">Nueva Solicitud de Permiso</h1>
            </div>
            <Button onClick={onLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">

            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Formulario de Solicitud</h2>
                <p className="text-slate-500 mt-2">Complete los detalles a continuación para procesar su licencia.</p>
              </div>

              {/* Section 1: Detalles Clave */}
              <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden mb-8">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    Sede y Tipo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Sede o Ubicación</label>
                    <Select value={workSite} onValueChange={setWorkSite}>
                      <SelectTrigger className="h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-100 rounded-xl">
                        <SelectValue placeholder="Seleccionar ubicación..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oficina Principal">Oficina Principal</SelectItem>
                        <SelectItem value="Sucursal A">Sucursal A</SelectItem>
                        <SelectItem value="Sucursal B">Sucursal B</SelectItem>
                        <SelectItem value="Remoto">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tipo de Permiso</label>
                    <div className="space-y-2">
                      <Select value={permissionType} onValueChange={setPermissionType}>
                        <SelectTrigger className="h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-100 rounded-xl">
                          <SelectValue placeholder="Seleccione el motivo..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                          <SelectItem value="Licencia por Enfermedad">Licencia por Enfermedad</SelectItem>
                          <SelectItem value="Compensatorio">Compensatorio</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Balance preview */}
                      {availableBalance !== null && (
                        <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          Saldo actual disponible: <span className="font-bold">{availableBalance} días</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Fechas */}
              <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden mb-8">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Duración del Permiso
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Fecha de Inicio</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-12 border-slate-200 focus:ring-2 focus:ring-blue-100 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Fecha de Fin</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-12 border-slate-200 focus:ring-2 focus:ring-blue-100 rounded-xl"
                      />
                    </div>
                  </div>

                  {totalDays > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
                      <div className="flex items-center gap-2 text-blue-800">
                        <span className="font-bold text-2xl">{totalDays}</span>
                        <span className="opacity-80">días {availableBalance !== null ? 'serán descontados' : 'solicitados'}</span>
                      </div>
                      {availableBalance !== null && (
                        <div className="text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-100 shadow-sm text-xs font-bold">
                          Saldo restante estimado: {availableBalance - totalDays} días
                        </div>
                      )}
                    </div>
                  )}

                  {hasError && availableBalance !== null && (
                    <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <Alert className="border-red-200 bg-red-50 text-red-800 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <AlertDescription className="ml-2 font-medium">
                          No tiene suficiente saldo disponible ({availableBalance} días).
                        </AlertDescription>
                      </Alert>
                    </m.div>
                  )}
                </CardContent>
              </Card>

              {/* Section 3: Documentación y Notas */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-blue-500" />
                      Evidencia (Opcional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all group cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">Arrastre archivos aquí</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG o PNG hasta 5MB</p>
                      {file && (
                        <div className="mt-4 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium border border-green-200 inline-block">
                          ✓ {file.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Observaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Añada cualquier detalle relevante para su aprobador..."
                      className="min-h-[160px] border-slate-200 focus:ring-2 focus:ring-blue-100 rounded-xl resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Submit Actions */}
              <div className="mt-8 flex gap-4 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 py-6 text-base font-medium border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={hasError}
                  className="flex-[2] py-6 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar Solicitud
                </Button>
              </div>

            </m.div>

          </form>
        </main>
      </div>
    </LazyMotion>
  )
}
