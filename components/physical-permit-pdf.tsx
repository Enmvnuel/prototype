"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PhysicalPermitPdfProps {
  request: {
    id: string
    employeeName: string
    workSite: string
    startDate: string
    endDate: string
    totalDays: number
  }
  onBack: () => void
}

export default function PhysicalPermitPdf({ request, onBack }: PhysicalPermitPdfProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
      </div>

      {/* A4 Document */}
      <div className="max-w-4xl mx-auto bg-white p-16 shadow-lg min-h-screen">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 border-2 border-slate-400 flex items-center justify-center">📧</div>
            <h1 className="text-2xl font-bold text-slate-900">DOCUMENTO DE SALIDA - LICENCIA Y PERMISOS</h1>
            <div className="w-16 h-16 border-2 border-slate-400 flex items-center justify-center">📧</div>
          </div>
        </div>

        {/* Serial and Dates */}
        <div className="mb-8 space-y-2">
          <p className="text-sm">
            <strong>Número de Serie:</strong> SN-2025-001
          </p>
          <p className="text-sm">
            <strong>Fecha de Emisión:</strong> 2025-MM-DD
          </p>
        </div>

        {/* Work Location */}
        <div className="mb-8">
          <p className="text-sm mb-2">
            <strong>Lugar de Trabajo Asignado:</strong> Sede Central - Piso 4
          </p>
          <p className="text-sm">
            <strong>Dirección Física:</strong> Av. Javier Prado 1234, San Isidro, Lima
          </p>
        </div>

        {/* Employee Details Table */}
        <table className="w-full mb-8 border border-slate-300">
          <tbody>
            <tr className="border border-slate-300">
              <td className="p-3 bg-slate-100 font-semibold text-sm w-1/3">Nombre del Empleado:</td>
              <td className="p-3 text-sm">{request.employeeName}</td>
            </tr>
            <tr className="border border-slate-300">
              <td className="p-3 bg-slate-100 font-semibold text-sm">Unidad de Origen:</td>
              <td className="p-3 text-sm">Departamento de Operaciones</td>
            </tr>
            <tr className="border border-slate-300">
              <td className="p-3 bg-slate-100 font-semibold text-sm">Fecha de Aprobación:</td>
              <td className="p-3 text-sm">2025-MM-DD</td>
            </tr>
            <tr className="border border-slate-300">
              <td className="p-3 bg-slate-100 font-semibold text-sm">Duración de la Licencia:</td>
              <td className="p-3 text-sm">
                {request.totalDays} día{request.totalDays !== 1 ? "s" : ""} (Del {request.startDate} al{" "}
                {request.endDate})
              </td>
            </tr>
          </tbody>
        </table>

        {/* Spacer for Signatures */}
        <div className="mt-20 space-y-8">
          <div className="flex justify-between">
            <div className="text-center flex-1">
              <div className="border-t-2 border-slate-800 w-40 mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Firma del Supervisor</p>
            </div>
            <div className="text-center flex-1">
              <div className="border-t-2 border-slate-800 w-40 mx-auto mb-2"></div>
              <p className="text-sm font-semibold">Firma del Empleado</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-600">
          <p>Este documento es válido solo con las firmas correspondientes</p>
          <p>Cualquier alteración anula su validez</p>
        </div>
      </div>

      {/* Print Button */}
      <div className="max-w-4xl mx-auto mt-6 flex gap-4">
        <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Imprimir a PDF / Enviar a Impresora
        </Button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .min-h-screen {
            padding: 0;
            background: white;
          }
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
