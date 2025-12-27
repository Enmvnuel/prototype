"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { RequestData } from "@/context/app-context"
import { X, CheckCircle, AlertTriangle, FileText, User } from "lucide-react"

interface ReviewModalProps {
  request: RequestData
  onClose: () => void
  onApprove: () => void
  onReject: (notes: string) => void
  onReturn: () => void
}

export default function ReviewModal({ request, onClose, onApprove, onReject, onReturn }: ReviewModalProps) {
  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")

  // Cargar justificación existente si ya fue rechazada
  useEffect(() => {
    if (request.managerNotes && request.status === "RECHAZADO") {
      // No modificar el textarea, solo mostrar en sección separada
    }
  }, [request])

  const handleSubmit = () => {
    if (decision === "approve") {
      onApprove()
    } else if (decision === "reject") {
      if (!notes.trim()) {
        alert("Por favor complete la justificación para rechazar")
        return
      }
      // Guardar en localStorage
      const storedRequests = localStorage.getItem("elm-requests-v4")
      if (storedRequests) {
        try {
          const requests = JSON.parse(storedRequests)
          const updatedRequests = requests.map((req: any) => {
            if (req.id === request.id) {
              return { 
                ...req, 
                managerNotes: notes, 
                reviewedAt: new Date().toISOString().split('T')[0] 
              }
            }
            return req
          })
          localStorage.setItem("elm-requests-v4", JSON.stringify(updatedRequests))
        } catch (e) {
          console.error("Error al guardar la justificación", e)
        }
      }
      onReject(notes)
    } else if (decision === "return") {
      onReturn()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      {/* Modern Blurry Backdrop with dark gradient overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Glassmorphism Modal */}
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-[110] bg-white/95 backdrop-blur-xl border-white/20 ring-1 ring-black/5 rounded-3xl animate-in zoom-in-95 fade-in duration-300 flex flex-col">

        {/* Modern Header with subtle gradient */}
        <div className="relative sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100/80 flex items-center justify-between px-8 py-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Auditoría de Solicitudes</p>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Solicitud <span className="font-mono text-slate-400">#{request.id}</span>
            </CardTitle>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-100/80 text-slate-400 transition-colors h-10 w-10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 p-8 custom-scrollbar">
          <div className="space-y-8">
            {/* Employee Profile Card - Modern Floating Style */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <User className="w-32 h-32 -mr-8 -mt-8" />
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white">
                  {request.employeeName.charAt(0)}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{request.employeeName}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-500 mb-4">
                    <span className="font-medium">{request.workSite}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Solicitante</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur border border-slate-200 text-slate-600 font-medium px-3 py-1 shadow-sm">
                      <CheckCircle className="w-3 h-3 mr-1.5 text-emerald-500" />
                      Perfil Verificado
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 px-3 py-1 shadow-sm transition-colors">
                      {request.type}
                    </Badge>
                    <Badge className={`px-3 py-1 shadow-sm transition-colors ${request.status === 'APROBADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        request.status === 'RECHAZADO' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                      {request.status === 'PENDIENTE' ? 'En Revisión Gerencial' : request.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 text-slate-400">
                    <FileText className="w-4 h-4" />
                    Detalles de la Licencia
                  </h4>

                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-1">
                    <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden">
                      <div className="bg-white p-4 hover:bg-slate-50/80 transition-colors">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Inicio</p>
                        <p className="font-semibold text-slate-900 text-lg">{request.startDate}</p>
                      </div>
                      <div className="bg-white p-4 hover:bg-slate-50/80 transition-colors">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Fin</p>
                        <p className="font-semibold text-slate-900 text-lg">{request.endDate}</p>
                      </div>
                      <div className="col-span-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 flex items-center justify-between group cursor-default">
                        <div>
                          <p className="text-blue-500 text-[10px] uppercase tracking-widest font-bold mb-1">Duración Total</p>
                          <p className="font-bold text-blue-900 text-lg group-hover:scale-105 transition-transform origin-left">{request.totalDays} Días Hábiles</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-500">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Motivo y Justificación</h4>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"></div>
                    <p className="text-slate-600 italic leading-relaxed text-base relative z-10">
                      "{request.observations || "Sin observaciones adicionales proporcionadas."}"
                    </p>
                    <div className="absolute right-4 bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FileText className="w-16 h-16 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-4">Evidencia Adjunta</h4>
                  {request.evidence ? (
                    <div className="group border border-slate-200 hover:border-blue-300 hover:ring-4 hover:ring-blue-50 bg-white rounded-xl p-3 flex items-center gap-4 transition-all cursor-pointer shadow-sm">
                      <div className="h-12 w-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">constancia_medica_001.pdf</p>
                        <p className="text-xs text-slate-400">1.2 MB • PDF Document</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-semibold hover:bg-blue-50 hover:text-blue-700">
                        Ver Archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">No se requiere evidencia</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Decision */}
              <div className="flex flex-col h-full">
                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 text-slate-400">
                  <CheckCircle className="w-4 h-4" />
                  Dictamen Gerencial
                </h4>

                <div className="flex-1 bg-gradient-to-b from-slate-50 to-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
                  <RadioGroup value={decision} onValueChange={setDecision} className="space-y-4">
                    <label className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${decision === 'approve' ? 'bg-emerald-50/50 border-emerald-500 shadow-md shadow-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'}`}>
                      <RadioGroupItem value="approve" id="approve" className="mt-1 text-emerald-600 border-emerald-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'approve' ? 'text-emerald-900' : 'text-slate-700'}`}>Aprobar Solicitud</span>
                        <span className="text-xs text-slate-500 leading-relaxed block">
                          La solicitud cumple con las políticas. Se descontará del saldo correspondiente.
                        </span>
                      </div>
                    </label>

                    <label className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${decision === 'reject' ? 'bg-red-50/50 border-red-500 shadow-md shadow-red-100' : 'bg-white border-slate-100 hover:border-red-200 hover:bg-red-50/30'}`}>
                      <RadioGroupItem value="reject" id="reject" className="mt-1 text-red-600 border-red-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'reject' ? 'text-red-900' : 'text-slate-700'}`}>Rechazar Definitivamente</span>
                        <span className="text-xs text-slate-500 leading-relaxed block">
                          No procede. Se notificará al empleado el motivo del rechazo.
                        </span>
                      </div>
                    </label>

                    <label className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${decision === 'return' ? 'bg-amber-50/50 border-amber-500 shadow-md shadow-amber-100' : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/30'}`}>
                      <RadioGroupItem value="return" id="return" className="mt-1 text-amber-600 border-amber-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'return' ? 'text-amber-900' : 'text-slate-700'}`}>Devolver para Subsanación</span>
                        <span className="text-xs text-slate-500 leading-relaxed block">
                          Requiere correcciones o más información por parte del empleado.
                        </span>
                      </div>
                    </label>
                  </RadioGroup>

                  {decision === "reject" && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 block">Justificación Requerida</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Escriba aquí el motivo del rechazo para notificar al colaborador..."
                        className="min-h-[120px] bg-red-50/30 border-red-200 focus:border-red-400 focus:ring-red-200 text-sm resize-none rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Justificación de Rechazo Guardada - Nueva Sección */}
            {request.managerNotes && request.status === "RECHAZADO" && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="flex items-center gap-2 font-bold text-red-600 text-sm uppercase tracking-wider mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  Justificación del Rechazo Registrada
                </h4>
                <div className="bg-red-50/50 rounded-2xl border-2 border-red-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-2xl"></div>
                  <div className="relative z-10">
                    <p className="text-red-900 font-semibold text-sm mb-2">Motivo del rechazo:</p>
                    <p className="text-slate-700 leading-relaxed text-sm italic">
                      "{request.managerNotes}"
                    </p>
                    {request.reviewedAt && (
                      <p className="text-xs text-red-400 mt-4 uppercase font-bold tracking-wide">
                        Rechazado el: {request.reviewedAt}
                      </p>
                    )}
                  </div>
                  <div className="absolute right-4 bottom-4 opacity-5">
                    <FileText className="w-20 h-20 text-red-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Audit History */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="flex items-center gap-2 font-bold text-slate-400 text-xs uppercase tracking-wider mb-4">
                <AlertTriangle className="w-3 h-3" />
                Auditoría del Sistema
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 shadow-sm shadow-slate-300"></div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Solicitud Creada</p>
                    <p className="text-xs text-slate-500 mt-0.5">Por <strong>{request.employeeName}</strong></p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">{request.createdAt} • 09:41 AM</p>
                  </div>
                </div>
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500"></div>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Pre-validación Exitosa</p>
                    <p className="text-xs text-blue-600/80 mt-0.5">Saldo verificado automáticamente</p>
                    <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-wide">{request.createdAt} • 09:42 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md flex justify-end gap-4 rounded-b-3xl">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-6 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!decision}
            className={`px-8 h-11 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-95 ${decision === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' :
                decision === 'return' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                  'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-slate-900/20'
              }`}
          >
            Confirmar Decisión
          </Button>
        </div>
      </Card>
    </div>
  )
}
