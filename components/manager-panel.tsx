"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import ReviewModal from "./review-modal"
import { LogOut, Eye, CheckCircle, XCircle } from "lucide-react"

interface ManagerPanelProps {
  onLogout: () => void
  currentView: string
  onViewChange: (view: string) => void
}

export default function ManagerPanel({ onLogout, currentView, onViewChange }: ManagerPanelProps) {
  const { requests, updateRequest } = useAppContext()
  const [filterUnit, setFilterUnit] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [selectAll, setSelectAll] = useState(false)

  // Filter requests - Only show Manager requests (exclude current user's own requests if desired, or all)
  // Logic: In a real app, managers see their team. Here we just show the mock "MGR" requests.
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Basic filtering
      if (filterUnit !== "all" && req.workSite !== filterUnit) return false
      if (filterStatus !== "all" && req.status !== filterStatus) return false
      if (startDate && req.createdAt < startDate) return false
      if (endDate && req.createdAt > endDate) return false

      // Only show requests that look like they belong to 'others' (e.g. ID starts with REQ-MGR)
      // or just filter out the current user 'emp001'
      if (req.employeeId === "emp001") return false

      return true
    })
  }, [requests, filterUnit, filterStatus, startDate, endDate])

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedIds(new Set(filteredRequests.map((r) => r.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectId = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
      setSelectAll(false)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAction = (action: "approve" | "reject") => {
    selectedIds.forEach((id) => {
      const newStatus = action === "approve" ? "APROBADO" : "RECHAZADO"
      updateRequest(id, { status: newStatus })
    })
    setSelectedIds(new Set())
    setSelectAll(false)
  }

  const handlePrintPermits = () => {
    alert(`Generando ${selectedIds.size} papeletas físicas...`)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDIENTE: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendiente" },
      APROBADO: { bg: "bg-green-100", text: "text-green-800", label: "Aprobado" },
      RECHAZADO: { bg: "bg-red-100", text: "text-red-800", label: "Rechazado" },
    }
    const variant = variants[status] || variants.PENDIENTE
    return <Badge className={`${variant.bg} ${variant.text} border-0`}>{variant.label}</Badge>
  }

  if (reviewingId) {
    return (
      <ReviewModal
        request={requests.find((r) => r.id === reviewingId)!}
        onClose={() => setReviewingId(null)}
        onApprove={() => {
          updateRequest(reviewingId, { status: "APROBADO" })
          setReviewingId(null)
        }}
        onReject={() => {
          updateRequest(reviewingId, { status: "RECHAZADO" })
          setReviewingId(null)
        }}
        onReturn={() => {
          updateRequest(reviewingId, { status: "PENDIENTE" })
          setReviewingId(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Acceso Gerencial</h1>
            <p className="text-sm text-slate-600 mt-1">Bienvenido, Gerente General</p>
          </div>
          <Button onClick={onLogout} variant="ghost" className="text-slate-600 hover:text-slate-900">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-md">
          <CardHeader className="bg-slate-100 border-b border-slate-200">
            <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Unidad Organizacional</label>
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Unidades</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Operaciones">Operaciones</SelectItem>
                    <SelectItem value="RRHH">RRHH</SelectItem>
                    <SelectItem value="Finanzas">Finanzas</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Ventas">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de Fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="APROBADO">Aprobado</SelectItem>
                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {/* Trigger re-render or explicit search if needed, currently auto-filters */ }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Aplicar Filtros
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterUnit("all")
                  setFilterStatus("all")
                  setStartDate("")
                  setEndDate("")
                }}
              >
                Limpiar Todo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="mt-8 shadow-md">
          <CardHeader className="bg-slate-100 border-b border-slate-200 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">
              Solicitudes ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead className="text-slate-700 font-semibold">Empleado</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Área</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Fechas</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">Días</TableHead>
                    <TableHead className="text-slate-700 font-semibold text-center">Evidencia</TableHead>
                    {/* Removed Audit History Column */}
                    <TableHead className="text-slate-700 font-semibold">Estado</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        No se encontraron solicitudes.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-slate-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(req.id)}
                            onCheckedChange={(checked) => handleSelectId(req.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 font-bold">
                              {req.employeeName.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{req.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{req.workSite}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {req.startDate} <br /><span className="text-slate-400">al</span> {req.endDate}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium">{req.totalDays}</TableCell>
                        <TableCell className="text-center">
                          {req.evidence ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-300 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => setReviewingId(req.id)}
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            Revisar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 sticky bottom-8 p-4 bg-white/90 backdrop-blur-sm border rounded-lg shadow-lg">
          <Button
            onClick={() => handleBulkAction("approve")}
            disabled={selectedIds.size === 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Aprobar ({selectedIds.size})
          </Button>
          <Button
            onClick={() => handleBulkAction("reject")}
            disabled={selectedIds.size === 0}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Rechazar ({selectedIds.size})
          </Button>
          <Button
            onClick={handlePrintPermits}
            disabled={selectedIds.size === 0}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Imprimir Papeletas ({selectedIds.size})
          </Button>
        </div>
      </div>
    </div>
  )
}

