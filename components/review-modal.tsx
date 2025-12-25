"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { RequestData } from "@/context/app-context"
import { X } from "lucide-react"

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50">
          <CardTitle>Revisión de Solicitud: {request.id}</CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Request Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Nombre del Empleado</p>
              <p className="font-semibold text-slate-900">{request.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tipo de Solicitud</p>
              <p className="font-semibold text-slate-900">{request.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Fechas Solicitadas</p>
              <p className="font-semibold text-slate-900">
                {request.startDate} al {request.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Días Totales</p>
              <p className="font-semibold text-slate-900">{request.totalDays} días</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Sede de Trabajo</p>
              <p className="font-semibold text-slate-900">{request.workSite}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Estado Actual</p>
              <Badge className="mt-1 bg-yellow-100 text-yellow-800 border-0">
                {request.status === "PENDIENTE" ? "Pendiente" : request.status}
              </Badge>
            </div>
          </div>

          {/* Evidence Preview */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Vista Previa de Evidencia (PDF/JPG)</h3>
            <div className="border-2 border-red-300 rounded-lg p-12 bg-slate-50 text-center">
              <p className="text-slate-500">[Mock Image/PDF Preview]</p>
            </div>
          </div>

          {/* Audit Log */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Historial de Auditoría</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-slate-600">
                <strong>Creado:</strong> 10:00 AM por Juan Perez
              </p>
              <p className="text-slate-600">
                <strong>Modificado:</strong> 11:30 AM por María García (Estado: Pendiente)
              </p>
            </div>
          </div>

          {/* Decision Selector */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Decisión del Gerente</h3>
            <RadioGroup value={decision} onValueChange={setDecision}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="approve" id="approve" />
                <label htmlFor="approve" className="text-slate-700 cursor-pointer">
                  Aprobar Solicitud
                </label>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="reject" id="reject" />
                <label htmlFor="reject" className="text-slate-700 cursor-pointer">
                  Rechazar (Requiere Justificación)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="return" id="return" />
                <label htmlFor="return" className="text-slate-700 cursor-pointer">
                  Devolver para Corrección (Subsanación)
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Justification Textarea */}
          {decision === "reject" && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Zona de Justificación de Rechazo</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escriba la justificación detallada para rechazar esta solicitud..."
                className="min-h-32"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!decision}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Decisión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
