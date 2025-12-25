"use client"

import { useState } from "react"
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
  onReject: () => void
  onReturn: () => void
}

export default function ReviewModal({ request, onClose, onApprove, onReject, onReturn }: ReviewModalProps) {
  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    if (decision === "approve") {
      onApprove()
    } else if (decision === "reject") {
      if (!notes.trim()) {
        alert("Por favor complete la justificación para rechazar")
        return
      }
      onReject()
    } else if (decision === "return") {
      onReturn()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-60 bg-white/95 border-0 ring-1 ring-white/20 rounded-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 flex flex-row items-center justify-between p-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AUDITORÍA DE SOLICITUDES</p>
            <CardTitle className="text-xl text-slate-900">Referencia: #{request.id}</CardTitle>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Employee Info Header */}
          <div className="flex items-start gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
              {request.employeeName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{request.employeeName}</h3>
              <p className="text-slate-500 mb-2">{request.workSite} • Solicitante</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-600 font-normal shadow-sm">
                  <User className="w-3 h-3 mr-1" /> Perfil Verificado
                </Badge>
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 shadow-sm">
                  {request.type}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Estado Actual</p>
              <Badge className={`mt-1 text-base px-3 py-1 ${request.status === 'APROBADO' ? 'bg-green-100 text-green-700' : request.status === 'RECHAZADO' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {request.status === "PENDIENTE" ? "En Revisión" : request.status}
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Details Column */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 font-semibold text-slate-900 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Detalles de la Licencia
              </h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500 text-xs uppercase mb-1">Inicio</p>
                  <p className="font-semibold text-slate-800">{request.startDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500 text-xs uppercase mb-1">Fin</p>
                  <p className="font-semibold text-slate-800">{request.endDate}</p>
                </div>
                <div className="col-span-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <p className="text-blue-500 text-xs uppercase mb-1">Duración Total</p>
                  <p className="font-bold text-blue-900 text-lg">{request.totalDays} Días Hábiles</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-2">Evidencia Adjunta</h4>
                {request.evidence ? (
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">certificado_medico_001.pdf</p>
                      <p className="text-xs text-slate-400">1.2 MB</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600">Ver</Button>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400 text-sm italic">
                    No se requiere evidencia para este tipo de solicitud
                  </div>
                )}
              </div>
            </div>

            {/* Action Column */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 font-semibold text-slate-900 border-b border-slate-100 pb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Dictamen Gerencial
              </h4>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <RadioGroup value={decision} onValueChange={setDecision} className="space-y-3">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${decision === 'approve' ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-white border border-transparent'}`}>
                    <RadioGroupItem value="approve" id="approve" className="text-emerald-600 border-emerald-600" />
                    <label htmlFor="approve" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      Aprobar Solicitud
                    </label>
                  </div>

                  <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${decision === 'reject' ? 'bg-red-50 border border-red-100' : 'hover:bg-white border border-transparent'}`}>
                    <RadioGroupItem value="reject" id="reject" className="text-red-600 border-red-600" />
                    <label htmlFor="reject" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      Rechazar Definitivamente
                    </label>
                  </div>

                  <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${decision === 'return' ? 'bg-yellow-50 border border-yellow-100' : 'hover:bg-white border border-transparent'}`}>
                    <RadioGroupItem value="return" id="return" className="text-yellow-600 border-yellow-600" />
                    <label htmlFor="return" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                      Devolver para Subsanación
                    </label>
                  </div>
                </RadioGroup>

                {decision === "reject" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Justificación Requerida</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Explique el motivo del rechazo..."
                      className="min-h-[100px] bg-white text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit History (As requested to be kept here) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Historial de Auditoría
            </h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm border border-slate-100">
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 font-medium">Solicitud Creada</p>
                  <p className="text-slate-500 text-xs">Por {request.employeeName} • {request.createdAt} 09:41 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-300 flex-shrink-0" />
                <div>
                  <p className="text-slate-900 font-medium">Validación Automática</p>
                  <p className="text-slate-500 text-xs">Sistema • {request.createdAt} 09:42 AM • Saldo verificado</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3">
          <Button onClick={onClose} variant="outline" className="px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!decision}
            className={`px-8 rounded-xl text-white shadow-lg transition-all ${decision === 'reject' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                decision === 'return' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200' :
                  'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
              }`}
          >
            Confirmar Decisión
          </Button>
        </div>
      </Card>
    </div>
  )
}
