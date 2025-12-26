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
import { LogOut, Eye, CheckCircle, XCircle, Search, Calendar, ChevronDown } from "lucide-react"
import { m, LazyMotion, domAnimation } from "framer-motion"

interface ManagerPanelProps {
  onLogout: () => void
  currentView: "panel" | "review-modal"
  onViewChange: (view: any) => void
}

// Printable Permit Component
function PrintablePermit({ request }: { request: any }) {
  const serialNumber = `SN-2025-${request.id.replace('REQ', '')}`
  const currentDate = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })
  // Use createdAt or current date for approval if status is approved. 
  // Since we don't store approval date separately in mock data, 'currentDate' of printing 
  // usually implies the date the document is issued/validated.
  const approvalDate = request.status === 'APROBADO' ? currentDate : 'PENDIENTE DE FIRMA'

  return (
    <div className="p-8 font-sans max-w-[800px] mx-auto border border-black mb-8 page-break" style={{ pageBreakAfter: 'always' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-slate-800 pb-4">
        <div className="w-32 h-20 border border-slate-400 flex items-center justify-center bg-slate-50 text-xs text-slate-400">
          LOGO EMPRESA
        </div>
        <div className="flex-1 px-4 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">DOCUMENTO DE SALIDA</h1>
          <h2 className="text-lg font-bold text-slate-700">LICENCIA Y PERMISOS</h2>
        </div>
        <div className="w-32 h-20 border border-slate-400 flex items-center justify-center bg-slate-50 text-xs text-slate-400">
          LOGO/QR
        </div>
      </div>

      {/* Metadata Section */}
      <div className="mb-8 text-sm space-y-1 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
        <p><strong className="text-slate-800">Número de Serie:</strong> {serialNumber}</p>
        <p><strong className="text-slate-800">Fecha de Emisión:</strong> {currentDate}</p>
        <div className="h-2"></div>
        <p><strong className="text-slate-800">Lugar de Trabajo Asignado:</strong> Sede Central - Piso 4</p>
        <p><strong className="text-slate-800">Dirección Física:</strong> Av. Javier Prado 1234, San Isidro, Lima</p>
      </div>

      {/* Main Table */}
      <div className="border border-slate-300 rounded-sm mb-16 overflow-hidden">
        <div className="flex border-b border-slate-300">
          <div className="w-1/3 p-3 bg-slate-100 font-bold text-slate-800 border-r border-slate-300 text-sm flex items-center">
            Nombre del Empleado:
          </div>
          <div className="w-2/3 p-3 text-sm text-slate-700 font-medium">
            {request.employeeName}
          </div>
        </div>
        <div className="flex border-b border-slate-300">
          <div className="w-1/3 p-3 bg-slate-100 font-bold text-slate-800 border-r border-slate-300 text-sm flex items-center">
            Unidad de Origen:
          </div>
          <div className="w-2/3 p-3 text-sm text-slate-700 font-medium">
            {request.workSite}
          </div>
        </div>
        <div className="flex border-b border-slate-300">
          <div className="w-1/3 p-3 bg-slate-100 font-bold text-slate-800 border-r border-slate-300 text-sm flex items-center">
            Fecha de Aprobación:
          </div>
          <div className="w-2/3 p-3 text-sm text-slate-700 font-medium">
            {approvalDate}
          </div>
        </div>
        <div className="flex">
          <div className="w-1/3 p-3 bg-slate-100 font-bold text-slate-800 border-r border-slate-300 text-sm flex items-center">
            Duración de la Licencia:
          </div>
          <div className="w-2/3 p-3 text-sm text-slate-700 font-medium">
            {request.totalDays} días <span className="text-slate-500 ml-1">(Del {request.startDate} al {request.endDate})</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-32 px-8 gap-12">
        <div className="text-center w-1/2">
          <div className="border-t-2 border-slate-800 pt-2 mb-1"></div>
          <p className="text-sm font-bold text-slate-900">Firma del Supervisor</p>
          <p className="text-xs text-slate-500 mt-1">Autorizado por Gerencia</p>
        </div>
        <div className="text-center w-1/2">
          <div className="border-t-2 border-slate-800 pt-2 mb-1"></div>
          <p className="text-sm font-bold text-slate-900">Firma del Empleado</p>
          <p className="text-xs text-slate-500 mt-1">Conformidad de Recepción</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 text-center">
        <p className="text-[10px] text-slate-400">
          Este documento es válido solo con las firmas correspondientes. Cualquier alteración anula su validez.<br />
          Sistema de Gestión de Licencias v1.0 | Generado el {currentDate}
        </p>
      </div>
    </div>
  )
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
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (filterUnit !== "all" && req.workSite !== filterUnit) return false
      if (filterStatus !== "all" && req.status !== filterStatus) return false
      if (startDate && req.createdAt < startDate) return false
      if (endDate && req.createdAt > endDate) return false
      if (req.employeeId === "emp001") return false // Filter out own requests
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
    window.print()
  }

  const getStatusBadge = (status: string) => {
    if (status === "PENDIENTE") {
      return <Badge className="bg-yellow-400 text-yellow-900 border-0 hover:bg-yellow-500 rounded-md font-bold px-3 shadow-sm">PENDIENTE</Badge>
    } else if (status === "APROBADO") {
      return <Badge className="bg-green-500 text-white border-0 hover:bg-green-600 rounded-md font-bold px-3 shadow-sm">APROBADO</Badge>
    } else {
      return <Badge className="bg-red-500 text-white border-0 hover:bg-red-600 rounded-md font-bold px-3 shadow-sm">RECHAZADO</Badge>
    }
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

  const requestsToPrint = requests.filter(r => selectedIds.has(r.id))

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* Printable Section - Only visible when printing */}
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999]">
          {requestsToPrint.length > 0 ? (
            requestsToPrint.map((req) => (
              <PrintablePermit key={req.id} request={req} />
            ))
          ) : (
            <div className="p-8 text-center text-xl">Por favor, seleccione al menos una solicitud para imprimir.</div>
          )}
        </div>

        {/* Regular Dashboard - Hidden when printing */}
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 print:hidden">

          {/* Top Navigation / Breadcrumb */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="text-sm font-medium text-slate-500">
                <span className="text-slate-900 hover:text-slate-700 cursor-pointer transition-colors">Inicio</span> &gt; Gestión &gt; <span className="text-slate-900 font-semibold">Panel Gerencial</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-right hidden sm:block">
                  <span className="font-bold text-slate-800 block">Cristopher Arias</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Administrador</span>
                </div>
                <Button onClick={onLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

            {/* Welcome Section */}
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-end gap-4"
            >
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Solicitudes de Equipo</h2>
                <p className="text-slate-500 mt-1">Gestione y audite las solicitudes de licencias pendientes.</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Pendientes: <span className="font-bold text-slate-900">{requests.filter(r => r.status === 'PENDIENTE' && r.employeeId !== 'emp001').length}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Total: <span className="font-bold text-slate-900">{filteredRequests.length}</span>
                </div>
              </div>
            </m.div>

            {/* Filters Bar */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-end lg:items-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Unidad</label>
                  <Select value={filterUnit} onValueChange={setFilterUnit}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-10 rounded-lg focus:ring-2 focus:ring-blue-100"><SelectValue placeholder="Todas" /></SelectTrigger>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Estado</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 h-10 rounded-lg focus:ring-2 focus:ring-blue-100"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="APROBADO">Aprobado</SelectItem>
                      <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Desde</label>
                  <div className="relative">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block w-full p-2.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Hasta</label>
                  <div className="relative">
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block w-full p-2.5" />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => { setFilterUnit("all"); setFilterStatus("all"); setStartDate(""); setEndDate(""); }}
                  className="text-slate-500 hover:text-red-500 hover:bg-red-50"
                >
                  Limpiar
                </Button>
              </div>
            </m.div>

            {/* Table Container */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-black/5"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Listado de Solicitudes</h3>
                <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-md">{filteredRequests.length} registros</span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-100">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12 pl-4"><Checkbox checked={selectAll} onCheckedChange={handleSelectAll} /></TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 w-[100px]">ID</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Empleado</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Unidad</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Fechas</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center py-4">Días</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center py-4">Evidencia</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Estado</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-right pr-6 py-4">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center text-slate-400">
                          No hay solicitudes que coincidan con los filtros.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((req, index) => (
                        <TableRow key={req.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors h-[72px]">
                          <TableCell className="pl-4">
                            <Checkbox checked={selectedIds.has(req.id)} onCheckedChange={(checked) => handleSelectId(req.id, checked as boolean)} />
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-500">
                            {req.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm border border-white">
                                {req.employeeName.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-700 text-sm">{req.employeeName}</span>
                                <span className="text-[10px] text-slate-400 font-medium tracking-wide">ID: {req.employeeId}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 font-medium text-sm">{req.workSite}</TableCell>
                          <TableCell className="text-slate-500 font-medium text-xs">
                            <div className="flex flex-col">
                              <span>{req.startDate}</span>
                              <span className="text-slate-300">a</span>
                              <span>{req.endDate}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-md text-sm">{req.totalDays}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {req.evidence ? (
                              <div className="flex justify-center"><CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" /></div>
                            ) : (
                              <div className="flex justify-center"><XCircle className="w-5 h-5 text-slate-300" /></div>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(req.status)}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReviewingId(req.id)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium"
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
            </m.div>

            {/* Bulk Actions Footer - Sticky */}
            <m.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-2xl flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              <div className="text-sm font-medium text-slate-600 pl-2">
                {selectedIds.size > 0 ? (
                  <span className="text-slate-900 font-bold">{selectedIds.size} solicitudes seleccionadas</span>
                ) : (
                  <span>Seleccione solicitudes para acciones masivas</span>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button onClick={() => handleBulkAction("approve")} disabled={selectedIds.size === 0} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                  Aprobar Selección
                </Button>
                <Button onClick={() => handleBulkAction("reject")} disabled={selectedIds.size === 0} className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20">
                  Rechazar Selección
                </Button>
                <Button onClick={handlePrintPermits} disabled={selectedIds.size === 0} variant="outline" className="flex-1 sm:flex-none border-slate-300 text-slate-700">
                  Imprimir
                </Button>
              </div>
            </m.div>

          </main>
        </div>
      </>
    </LazyMotion>
  )
}
