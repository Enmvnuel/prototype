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
import { ArrowLeft, LogOut, AlertCircle } from "lucide-react"

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
    permissionType === "Vacaciones" ? balance.vacation : permissionType === "Compensatorio" ? balance.compensatory : 999

  const hasError = totalDays > availableBalance && totalDays > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!workSite || !permissionType || !startDate || !endDate) {
      setError("Por favor complete todos los campos requeridos")
      return
    }

    if (hasError) {
      setError(`Los días solicitados exceden su saldo actual de ${availableBalance} días.`)
      return
    }

    // Create new request
    const newRequest = {
      id: `REQ${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(3, "0")}`,
      employeeId,
      employeeName: "Nombre del Empleado",
      type: permissionType as "Vacaciones" | "Licencia por Enfermedad" | "Compensatorio",
      startDate,
      endDate,
      totalDays,
      workSite,
      status: "PENDIENTE" as const,
      createdAt: new Date().toISOString().split("T")[0],
      observations,
      evidence: file,
    }

    addRequest(newRequest)
    setSubmitted(true)

    // Reset form
    setTimeout(() => {
      onBack()
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Solicitud Enviada!</h2>
            <p className="text-slate-600 mb-6">
              Tu solicitud ha sido registrada correctamente. Redirigiendo al panel principal...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">Formulario Oficial de Solicitud de Permiso</h1>
          </div>
          <Button onClick={onLogout} variant="ghost" className="text-slate-600 hover:text-slate-900">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Sede y Oficina Asignada */}
          <Card>
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg">Sede y Oficina Asignada</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Marcador de Posición</label>
              <Select value={workSite} onValueChange={setWorkSite}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar sede..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oficina Principal">Oficina Principal</SelectItem>
                  <SelectItem value="Sucursal A">Sucursal A</SelectItem>
                  <SelectItem value="Sucursal B">Sucursal B</SelectItem>
                  <SelectItem value="Remoto">Remoto</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Section 2: Tipo de Permiso y Fechas */}
          <Card>
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg">Tipo de Permiso</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Permiso</label>
                <Select value={permissionType} onValueChange={setPermissionType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                    <SelectItem value="Licencia por Enfermedad">Licencia por Enfermedad</SelectItem>
                    <SelectItem value="Compensatorio">Compensatorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Inicio</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Fin</label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full" />
                </div>
              </div>

              {totalDays > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-900">
                    <strong>Días Totales a Deducir:</strong> {totalDays} días
                  </p>
                  <p className="text-sm text-blue-800 mt-1">Saldo disponible: {availableBalance} días</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {hasError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 ml-2">
                Error: Los días solicitados exceden su saldo actual de {availableBalance} días.
              </AlertDescription>
            </Alert>
          )}

          {/* Section 3: Evidencia */}
          <Card>
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg">Zona de Adjuntar Evidencia</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                <p className="text-slate-600 mb-2">Arrostre y Suelte archivos PDF/JPG</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <span className="text-blue-600 cursor-pointer hover:underline">o haga clic para seleccionar</span>
                </label>
                {file && <p className="text-sm text-green-600 mt-2">✓ {file.name}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Observaciones */}
          <Card>
            <CardHeader className="bg-slate-100 border-b border-slate-200">
              <CardTitle className="text-lg">Observaciones del Empleado</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Escriba aquí sus observaciones adicionales (opcional)"
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button type="button" onClick={onBack} variant="outline" className="flex-1 bg-transparent">
              Limpiar Formulario/Cancelar
            </Button>
            <Button
              type="submit"
              disabled={hasError}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Validar y Enviar Solicitud
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            La presentación se registrará con un ID de Seguimiento único y una Marca de Tiempo para la auditoría.
          </p>
        </form>
      </div>
    </div>
  )
}
