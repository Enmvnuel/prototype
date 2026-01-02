"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { RequestData } from "@/context/app-context"
import { X, CheckCircle, AlertCircle, FileText, User } from "lucide-react"

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
      {/* Modern Blurry Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Glassmorphism Modal */}
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-[110] bg-[#FDFDFC] border-0 ring-1 ring-black/5 rounded-[2.5rem] animate-in zoom-in-95 fade-in duration-300 flex flex-col">

        {/* Modern Header */}
        <div className="relative sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-50 flex items-center justify-between px-8 py-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Auditoría de Solicitudes</p>
            </div>
            <CardTitle className="text-2xl font-serif text-slate-900 flex items-center gap-2">
              Solicitud <span className="font-sans text-slate-400 text-lg">#{request.id}</span>
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
            {/* Employee Profile Card */}
            <div className="relative overflow-hidden bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <User className="w-40 h-40 -mr-10 -mt-10" />
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-3xl font-serif font-bold ring-1 ring-white/20">
                  {request.employeeName.charAt(0)}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-3xl font-serif font-bold text-white tracking-tight mb-2">{request.employeeName}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/60 mb-6">
                    <span className="font-medium text-sm border-r border-white/20 pr-4">{request.workSite}</span>
                    <span className="font-medium text-sm">Solicitante</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <Badge variant="secondary" className="bg-white/10 backdrop-blur border-0 text-white font-medium px-4 py-1.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-400" />
                      Perfil Verificado
                    </Badge>
                    <Badge className="bg-primary text-white border-0 px-4 py-1.5 rounded-full">
                      {request.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Detalles de la Licencia
                  </h4>

                  <div className="bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-px bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-50">
                      <div className="bg-white p-6 hover:bg-slate-50 transition-colors">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">Inicio</p>
                        <p className="font-serif font-bold text-slate-900 text-xl">{request.startDate}</p>
                      </div>
                      <div className="bg-white p-6 hover:bg-slate-50 transition-colors">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">Fin</p>
                        <p className="font-serif font-bold text-slate-900 text-xl">{request.endDate}</p>
                      </div>
                      <div className="col-span-2 bg-slate-50 p-6 flex items-center justify-between group">
                        <div>
                          <p className="text-primary text-[10px] uppercase tracking-widest font-bold mb-1">Duración Total</p>
                          <p className="font-bold text-slate-900 text-2xl group-hover:scale-105 transition-transform origin-left">{request.totalDays} <span className="text-sm font-normal text-slate-500">Días Hábiles</span></p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Motivo y Justificación</h4>
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl"></div>
                    <p className="text-slate-600 italic leading-relaxed text-base relative z-10 font-medium">
                      "{request.observations || "Sin observaciones adicionales proporcionadas."}"
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Evidencia Adjunta</h4>
                  {request.evidence ? (
                    <div className="group border border-slate-200 hover:border-primary/50 hover:bg-primary/5 bg-white rounded-[1.5rem] p-4 flex items-center gap-4 transition-all cursor-pointer shadow-sm">
                      <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors text-sm">constancia_medica_001.pdf</p>
                        <p className="text-xs text-slate-400 mt-1">1.2 MB • PDF Document</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-white hover:shadow-md rounded-full px-4">
                        Ver
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 bg-slate-50 rounded-[1.5rem] p-8 flex flex-col items-center justify-center text-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-bold">No se requiere evidencia</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Decision */}
              <div className="flex flex-col h-full">
                <h4 className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Dictamen Gerencial
                </h4>

                <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col gap-4">
                  <RadioGroup value={decision} onValueChange={setDecision} className="space-y-4">
                    <label className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${decision === 'approve' ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                      <RadioGroupItem value="approve" id="approve" className="mt-1 text-teal-600 border-teal-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'approve' ? 'text-teal-900' : 'text-slate-700'}`}>Aprobar Solicitud</span>
                        <span className="text-xs text-slate-500 leading-relaxed block group-hover:text-slate-600">
                          La solicitud cumple con las políticas. Se descontará del saldo correspondiente.
                        </span>
                      </div>
                    </label>

                    <label className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${decision === 'reject' ? 'bg-pink-50 border-pink-500 shadow-md' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                      <RadioGroupItem value="reject" id="reject" className="mt-1 text-pink-600 border-pink-600 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'reject' ? 'text-pink-900' : 'text-slate-700'}`}>Rechazar Definitivamente</span>
                        <span className="text-xs text-slate-500 leading-relaxed block group-hover:text-slate-600">
                          No procede. Se notificará al empleado el motivo del rechazo.
                        </span>
                      </div>
                    </label>

                    <label className={`relative flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${decision === 'return' ? 'bg-amber-50 border-amber-500 shadow-md' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                      <RadioGroupItem value="return" id="return" className="mt-1 text-amber-600 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                      <div className="flex-1">
                        <span className={`block font-bold mb-1 ${decision === 'return' ? 'text-amber-900' : 'text-slate-700'}`}>Devolver para Subsanación</span>
                        <span className="text-xs text-slate-500 leading-relaxed block group-hover:text-slate-600">
                          Requiere correcciones o más información por parte del empleado.
                        </span>
                      </div>
                    </label>
                  </RadioGroup>

                  {decision === "reject" && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-4">
                      <label className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 block ml-1">Justificación Requerida</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Escriba aquí el motivo del rechazo para notificar al colaborador..."
                        className="min-h-[140px] bg-pink-50/50 border-pink-200 focus:border-pink-400 focus:ring-pink-200 text-sm resize-none rounded-2xl p-4 placeholder:text-pink-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Justificación de Rechazo Guardada */}
            {request.managerNotes && request.status === "RECHAZADO" && (
              <div className="pt-6 border-t border-slate-100">
                <h4 className="flex items-center gap-2 font-bold text-pink-600 text-sm uppercase tracking-wider mb-4">
                  <AlertCircle className="w-4 h-4" />
                  Justificación del Rechazo Registrada
                </h4>
                <div className="bg-pink-50 rounded-[2rem] border border-pink-100 p-8 relative overflow-hidden">
                  <p className="text-pink-900 font-semibold text-sm mb-3">Motivo del rechazo:</p>
                  <p className="text-slate-700 leading-relaxed text-sm italic font-medium">
                    "{request.managerNotes}"
                  </p>
                  {request.reviewedAt && (
                    <p className="text-xs text-pink-400 mt-6 uppercase font-bold tracking-wide">
                      Rechazado el: {request.reviewedAt}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-white/50 backdrop-blur-md flex justify-end gap-4 rounded-b-[2.5rem]">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-8 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold transition-all h-12"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!decision}
            className={`px-10 h-12 rounded-full text-white font-bold shadow-lg transition-all transform active:scale-95 ${decision === 'reject' ? 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/30' :
              decision === 'return' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                decision === 'approve' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/30' :
                  'bg-slate-900 shadow-slate-900/10'
              }`}
          >
            Confirmar Decisión
          </Button>
        </div>
      </Card>
    </div>
  )
}
