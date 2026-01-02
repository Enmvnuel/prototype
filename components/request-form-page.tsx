"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppContext } from "@/context/app-context"
import { ArrowLeft, LogOut, AlertCircle, UploadCloud, Calendar, MapPin, FileText, Check } from "lucide-react"
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

  // Auto-redirect after 3 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        onBack()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted, onBack])

  const balance = getEmployeeBalance("emp001")
  const employeeId = "emp001"
  const employeeName = "Bryan Lopez"

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0
    const startD = new Date(start)
    const endD = new Date(end)
    const diffMs = endD.getTime() - startD.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
    return Math.max(0, diffDays)
  }

  const totalDays = calculateDays(startDate, endDate)

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
      evidence: file ? true : false,
    }

    addRequest(newRequest)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex items-center justify-center p-4">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-2xl shadow-teal-500/10 text-center overflow-hidden bg-white/80 backdrop-blur-xl rounded-[2.5rem]">
              <CardContent className="pt-16 pb-12 space-y-8">
                <div className="relative">
                  <m.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-teal-200"
                  >
                    <Check className="w-10 h-10" strokeWidth={3} />
                  </m.div>
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-slate-900 tracking-tight mb-4">¡Solicitud Completada!</h2>
                  <p className="text-slate-500 font-medium px-8 text-sm leading-relaxed">
                    Su solicitud de <span className="text-slate-900 font-bold">{permissionType}</span> por <span className="text-slate-900 font-bold">{totalDays} días</span> ha sido enviada correctamente.
                  </p>
                </div>

                <div className="space-y-4 px-8">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <m.div
                      initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }}
                      className="h-full bg-teal-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center">Procesando y redirigiendo...</p>
                </div>

                <div className="pt-4 px-8">
                  <Button
                    onClick={onBack}
                    className="w-full py-7 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-lg transition-transform active:scale-95"
                  >
                    Regresar al Inicio
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
      <div className="min-h-screen bg-[#FDFDFC] font-sans text-slate-900 pb-20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-full px-4">
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span className="font-medium">Volver</span>
              </Button>
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              <h1 className="font-serif text-xl text-slate-800">Nueva Solicitud</h1>
            </div>
            <Button onClick={onLogout} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-10">

            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-serif text-slate-900 mb-3">Detalles de la Licencia</h2>
                <p className="text-slate-500">Complete los detalles a continuación para procesar su solicitud.</p>
              </div>

              {/* Section 1: Detalles Clave */}
              <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden mb-8 rounded-[2rem] bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-50 py-5 px-8">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Ubicación y Tipo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Sede o Ubicación</label>
                    <Select value={workSite} onValueChange={setWorkSite}>
                      <SelectTrigger className="h-14 bg-slate-50 border-slate-100 focus:ring-2 focus:ring-primary/20 rounded-2xl px-4">
                        <SelectValue placeholder="Seleccionar ubicación..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        <SelectItem value="Oficina Principal">Oficina Principal</SelectItem>
                        <SelectItem value="Sucursal A">Sucursal A</SelectItem>
                        <SelectItem value="Sucursal B">Sucursal B</SelectItem>
                        <SelectItem value="Remoto">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Motivo</label>
                    <div className="space-y-3">
                      <Select value={permissionType} onValueChange={setPermissionType}>
                        <SelectTrigger className="h-14 bg-slate-50 border-slate-100 focus:ring-2 focus:ring-primary/20 rounded-2xl px-4">
                          <SelectValue placeholder="Tipo de Permiso..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                          <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                          <SelectItem value="Licencia por Enfermedad">Licencia por Enfermedad</SelectItem>
                          <SelectItem value="Compensatorio">Compensatorio</SelectItem>
                        </SelectContent>
                      </Select>
                      {availableBalance !== null && (
                        <div className="text-xs font-medium text-purple-600 bg-purple-50 px-4 py-3 rounded-2xl flex items-center justify-between">
                          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div> Saldo disponible:</span>
                          <span className="font-bold text-lg">{availableBalance} días</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Fechas */}
              <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden mb-8 rounded-[2rem] bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-50 py-5 px-8">
                  <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Periodo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Inicio</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-14 bg-slate-50 border-slate-100 focus:ring-2 focus:ring-primary/20 rounded-2xl px-4"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Fin</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-14 bg-slate-50 border-slate-100 focus:ring-2 focus:ring-primary/20 rounded-2xl px-4"
                      />
                    </div>
                  </div>

                  {totalDays > 0 && (
                    <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between items-center text-sm gap-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                      <div className="flex items-center gap-4 text-white relative z-10">
                        <span className="font-serif text-5xl">{totalDays}</span>
                        <div className="flex flex-col">
                          <span className="opacity-90 font-medium text-lg">Días Solicitados</span>
                          <span className="text-white/50 text-xs">Total de días hábiles</span>
                        </div>
                      </div>

                      {availableBalance !== null && (
                        <div className="text-slate-900 bg-white px-5 py-3 rounded-full font-bold shadow-lg relative z-10">
                          Restante: {availableBalance - totalDays} días
                        </div>
                      )}
                    </div>
                  )}

                  {hasError && availableBalance !== null && (
                    <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <Alert className="border-red-100 bg-red-50 text-red-800 rounded-2xl">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <AlertDescription className="ml-2 font-medium">
                          No tiene suficiente saldo disponible (Máx: {availableBalance}).
                        </AlertDescription>
                      </Alert>
                    </m.div>
                  )}
                </CardContent>
              </Card>

              {/* Section 3: Documentación y Notas */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden rounded-[2rem] bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-50 py-5 px-8">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-primary" />
                      Evidencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-primary hover:bg-purple-50/50 transition-all group cursor-pointer relative h-full flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Subir Archivo</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, IMG hasta 5MB</p>
                      {file && (
                        <div className="mt-4 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-bold border border-teal-100">
                          ✓ {file.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden rounded-[2rem] bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-50 py-5 px-8">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Observaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Escriba aquí..."
                      className="min-h-[180px] border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 rounded-2xl resize-none p-4"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Submit Actions */}
              <div className="mt-12 flex gap-4 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 h-14 text-base font-bold bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={hasError}
                  className="flex-[2] h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Solicitud
                </Button>
              </div>

            </m.div>

          </form>
        </main>
      </div>
    </LazyMotion>
  )
}
