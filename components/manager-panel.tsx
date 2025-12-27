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
import { LogOut, Eye, CheckCircle, XCircle, Search, Calendar, ChevronDown, Filter } from "lucide-react"
import { m, LazyMotion, domAnimation } from "framer-motion"
import RequestStatusChart from "./request-status-chart"

interface ManagerPanelProps {
  onLogout: () => void
  currentView: "panel" | "review-modal"
  onViewChange: (view: any) => void
}

// Printable Permit Component
// Printable Permit Component
function PrintablePermit({ request }: { request: any }) {
  // Helpers for text formatting
  const formatDateLong = (dateStr: string) => {
    if (!dateStr) return "..."
    const date = new Date(dateStr)
    // Adjust for timezone offset
    const [y, m, d] = dateStr.split('-').map(Number)
    const localDate = new Date(y, m - 1, d)

    return localDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const startDateText = formatDateLong(request.startDate)
  const endDateText = formatDateLong(request.endDate)
  const currentYear = new Date().getFullYear()

  // Mock DNI and Position
  const mockDNI = "4" + Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  const position = "Colaborador(a)"

  return (
    <div className="p-8 font-sans max-w-[800px] mx-auto bg-white mb-4 page-break text-slate-900 flex flex-col h-auto min-h-[900px] relative" style={{ pageBreakAfter: 'always' }}>
      {/* Header with 3 Logos */}
      <div className="flex justify-between items-start mb-6 gap-4 px-2">
        {/* Left Logo Placeholder */}
        <div className="w-28 h-20 border border-slate-200 flex items-center justify-center p-2">
          <span className="text-[9px] text-center text-slate-300 uppercase">Logo Institucional</span>
        </div>

        {/* Center Logo */}
        <div className="w-40 h-24 border-2 border-slate-800 flex flex-col items-center justify-center bg-white">
          <span className="font-bold text-slate-900 text-xs tracking-widest">LOGO</span>
          <span className="font-bold text-slate-900 text-xs tracking-widest">EMPRESA</span>
        </div>

        {/* Right Logo Placeholder */}
        <div className="w-28 h-20 border border-slate-200 flex items-center justify-center p-2">
          <span className="text-[9px] text-center text-slate-300 uppercase">Logo Regional</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 px-4 flex flex-col">
        {/* Title */}
        <h1 className="text-xl font-black text-center mb-8 tracking-wide uppercase mt-2">
          AUTORIZACIÓN DE VACACIONES
        </h1>

        {/* Authorization Paragraph */}
        <div className="text-justify leading-relaxed text-sm mb-6">
          <p>
            El <span className="font-bold underline decoration-slate-900 decoration-2">Director ejecutivo de la Empire Electronics</span> autoriza a <span className="font-bold">{request.employeeName}</span>,
            identificado con DNI N° <span className="font-bold underline decoration-slate-900 decoration-2">{mockDNI}</span>, Servidor ({position})
            jurisdicción de la Empire Electronics, hacer uso de <span className="font-bold underline decoration-slate-900 decoration-2">vacaciones correspondiente</span> al
            año {currentYear - 1} a partir del {startDateText} al {endDateText} del año {currentYear} debiendo quedar en su lugar.
          </p>
        </div>

        {/* Employee Name Section - No Parentheses */}
        <div className="mb-6 pl-2">
          <p className="font-bold text-base mb-2">Sr(a) {request.employeeName}</p>
        </div>

        {/* Observations */}
        <div className="mb-4">
          <p className="font-bold mb-2 text-sm uppercase">Observaciones:</p>
          <div className="space-y-3">
            <div className="border-b border-black w-full min-h-[24px] text-sm pb-1">
              {request.observations || "Sin observaciones adicionales."}
            </div>
            <div className="border-b border-black h-6 w-full"></div>
            <div className="border-b border-black h-6 w-full"></div>
            <div className="border-b border-black h-6 w-full"></div>
          </div>
        </div>

        {/* Spacer to push signatures down properly */}
        <div className="flex-grow min-h-[40px]"></div>

        {/* Signatures */}
        <div className="flex justify-between items-end mb-8 px-4 gap-12 mt-8">
          <div className="text-center flex-1">
            <div className="border-t border-black w-full mb-2"></div>
            <p className="text-[10px] uppercase font-bold tracking-wide">FIRMA DEL INTERESADO</p>
          </div>
          <div className="text-center flex-1">
            <div className="border-t border-black w-full mb-2"></div>
            <p className="text-[10px] uppercase font-bold tracking-wide">FIRMA DEL JEFE DE AREA</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] leading-relaxed text-slate-800 border-t pt-2 border-transparent">
          <p>
            Nota: De acuerdo de las Directivas específicas de la <span className="underline decoration-wavy decoration-red-500">R.M.Nº</span> 0132-92-SA-P(30-09-92),
            Establecer que el periodo vacacional se inicia indefectiblemente el primer día de cada mes y <span className="underline decoration-blue-500">de forma</span> continua.
          </p>
        </div>
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
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Filter requests - Only show Manager requests (exclude current user's own requests if desired, or all)
  const filteredRequests = useMemo(() => {
    let result = requests.filter((req) => {
      if (filterUnit !== "all" && req.workSite !== filterUnit) return false
      if (filterStatus !== "all" && req.status !== filterStatus) return false
      if (startDate && req.createdAt < startDate) return false
      if (endDate && req.createdAt > endDate) return false
      if (req.employeeId === "emp001") return false // Filter out own requests
      return true
    })

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [requests, filterUnit, filterStatus, startDate, endDate, sortConfig])

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <span className="ml-1 text-slate-300">↕</span>
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-blue-600">↑</span> : <span className="ml-1 text-blue-600">↓</span>
  }

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
    setSelectAll(newSelected.size === filteredRequests.length && filteredRequests.length > 0)
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
    switch (status) {
      case "PENDIENTE":
        return <Badge className="bg-yellow-400 text-yellow-900 border-0 hover:bg-yellow-500 rounded-md font-bold px-3 shadow-sm">PENDIENTE</Badge>
      case "APROBADO":
        return <Badge className="bg-green-500 text-white border-0 hover:bg-green-600 rounded-md font-bold px-3 shadow-sm">APROBADO</Badge>
      case "RECHAZADO":
        return <Badge className="bg-red-500 text-white border-0 hover:bg-red-600 rounded-md font-bold px-3 shadow-sm">RECHAZADO</Badge>
      default:
        return <Badge className="bg-slate-500 text-white border-0">{status}</Badge>
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
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full items-end">
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

                <Button
                  onClick={() => { setFilterUnit("all"); setFilterStatus("all"); setStartDate(""); setEndDate(""); }}
                  className="bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 w-full h-10 font-medium transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </m.div>

            {/* Visual Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Component */}
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-[450px]"
              >
                <RequestStatusChart
                  requests={filteredRequests}
                  title="Distribución Actual"
                  description="Visualización de estados según filtros"
                  className="rounded-2xl border-slate-200 shadow-lg shadow-slate-200/40"
                />
              </m.div>

              {/* Executive Summary Card */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 p-8 flex flex-col justify-between h-[450px] relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Resumen Ejecutivo</h3>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Acciones Requeridas</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold text-slate-900 tracking-tight">{requests.filter(r => r.status === 'PENDIENTE' && r.employeeId !== 'emp001').length}</span>
                        <span className="text-lg text-slate-600 font-medium">solicitudes pendientes</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Estas solicitudes están esperando su aprobación o rechazo. Mantener este número bajo ayuda a la eficiencia operativa del equipo.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => setFilterStatus("PENDIENTE")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                      >
                        Filtrar Pendientes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setFilterStatus("all"); setFilterUnit("all"); }}
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Ver Todo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute -right-4 -bottom-4 w-48 h-48 bg-indigo-50/80 rounded-full blur-2xl"></div>
              </m.div>
            </div>

            {/* Table Container */}

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
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 w-[100px] cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('id')}>
                        <div className="flex items-center">ID <SortIcon column="id" /></div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('employeeName')}>
                        <div className="flex items-center">Empleado <SortIcon column="employeeName" /></div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('workSite')}>
                        <div className="flex items-center">Unidad <SortIcon column="workSite" /></div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('startDate')}>
                        <div className="flex items-center">Fechas <SortIcon column="startDate" /></div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center py-4 cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('totalDays')}>
                        <div className="flex items-center justify-center">Días <SortIcon column="totalDays" /></div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center py-4">Evidencia</TableHead>
                      <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4 cursor-pointer hover:bg-slate-100 hover:text-blue-600 transition-colors" onClick={() => handleSort('status')}>
                        <div className="flex items-center">Estado <SortIcon column="status" /></div>
                      </TableHead>
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
