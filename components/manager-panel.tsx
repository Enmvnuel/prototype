"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import ReviewModal from "./review-modal"
import { LogOut, Eye, CheckCircle, XCircle, Search, Calendar, ChevronDown, Filter, Printer } from "lucide-react"
import { m, LazyMotion, domAnimation } from "framer-motion"
import RequestStatusChart from "./request-status-chart"

interface ManagerPanelProps {
  onLogout: () => void
  currentView: "panel" | "review-modal"
  onViewChange: (view: any) => void
}

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
    <div className="p-12 font-serif max-w-[800px] mx-auto bg-white mb-4 page-break text-slate-900 flex flex-col h-auto min-h-[900px] relative" style={{ pageBreakAfter: 'always' }}>
      {/* Header with 3 Logos */}
      <div className="flex justify-between items-start mb-12 gap-4 px-2">
        <div className="w-32 h-20 border border-slate-100 flex items-center justify-center p-2 bg-slate-50">
          <span className="text-[10px] text-center text-slate-400 uppercase font-sans tracking-widest">Logo Inst.</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold tracking-widest text-slate-900 uppercase">CalmSpace</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em]">Sistema Corporativo</p>
        </div>

        <div className="w-32 h-20 border border-slate-100 flex items-center justify-center p-2 bg-slate-50">
          <span className="text-[10px] text-center text-slate-400 uppercase font-sans tracking-widest">Logo Reg.</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 px-8 flex flex-col">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-12 tracking-wide uppercase mt-2 font-sans">
          AUTORIZACIÓN DE VACACIONES
        </h1>

        {/* Authorization Paragraph */}
        <div className="text-justify leading-loose text-base mb-8 font-serif">
          <p>
            El <span className="font-bold border-b border-slate-300 pb-0.5">Director Ejecutivo de Empire Electronics</span> autoriza a <span className="font-bold text-lg">{request.employeeName}</span>,
            identificado con DNI N° <span className="font-bold border-b border-slate-300 pb-0.5">{mockDNI}</span>, Servidor ({position})
            jurisdicción de Empire Electronics, hacer uso de <span className="font-bold border-b border-slate-300 pb-0.5">vacaciones correspondientes</span> al
            año {currentYear - 1} a partir del {startDateText} al {endDateText} del año {currentYear} debiendo quedar en su lugar.
          </p>
        </div>

        {/* Observations */}
        <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <p className="font-bold mb-4 text-xs uppercase tracking-widest text-slate-500 font-sans">OBSERVACIONES / MOTIVOS:</p>
          <p className="text-slate-800 italic leading-relaxed">
            "{request.observations || "Sin observaciones adicionales."}"
          </p>
        </div>

        {/* Spacer to push signatures down properly */}
        <div className="flex-grow min-h-[40px]"></div>

        {/* Signatures */}
        <div className="flex justify-between items-end mb-12 px-4 gap-12 mt-12 font-sans">
          <div className="text-center flex-1">
            <div className="border-t border-slate-900 w-full mb-3"></div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">FIRMA DEL INTERESADO</p>
          </div>
          <div className="text-center flex-1">
            <div className="border-t border-slate-900 w-full mb-3"></div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">FIRMA DEL JEFE DE AREA</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[10px] leading-relaxed text-slate-400 border-t pt-4 border-slate-100 font-sans text-center">
          <p>
            Documento generado electrónicamente por CalmSpace Enterprise System.
            <br />Validez sujeta a verificación en el sistema.
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

  // Filter requests
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
    if (sortConfig?.key !== column) return <span className="ml-1 text-slate-300 opacity-50">↕</span>
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-primary">↑</span> : <span className="ml-1 text-primary">↓</span>
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
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 rounded-full font-bold px-3 shadow-none">Pendiente</Badge>
      case "APROBADO":
        return <Badge className="bg-teal-100 text-teal-700 border-0 rounded-full font-bold px-3 shadow-none">Aprobado</Badge>
      case "RECHAZADO":
        return <Badge className="bg-pink-100 text-pink-700 border-0 rounded-full font-bold px-3 shadow-none">Rechazado</Badge>
      default:
        return <Badge className="bg-slate-100 text-slate-500 border-0 rounded-full">{status}</Badge>
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
        onReject={(notes: string) => {
          updateRequest(reviewingId, {
            status: "RECHAZADO",
            managerNotes: notes,
            reviewedAt: new Date().toISOString().split('T')[0]
          })
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
        {/* Printable Section */}
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999]">
          {requestsToPrint.length > 0 ? (
            requestsToPrint.map((req) => (
              <PrintablePermit key={req.id} request={req} />
            ))
          ) : (
            <div className="p-8 text-center text-xl">Por favor, seleccione al menos una solicitud para imprimir.</div>
          )}
        </div>

        {/* Regular Dashboard */}
        <div className="min-h-screen bg-[#FDFDFC] font-sans text-slate-600 print:hidden pb-24">

          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <span className="font-serif">M</span>
                </div>
                <span className="font-serif text-xl font-bold text-slate-800">Panel de Gerencia</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-right hidden sm:block">
                  <span className="font-bold text-slate-800 block">Cristopher Arias</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Administrador</span>
                </div>
                <Button onClick={onLogout} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

            {/* Welcome Section */}
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-end gap-4"
            >
              <div>
                <h2 className="text-4xl font-serif text-slate-900 mb-2">Solicitudes de Equipo</h2>
                <p className="text-slate-500 text-lg">Gestione y audite las solicitudes de licencias pendientes.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
                  Pendientes: <span className="font-bold text-slate-900">{requests.filter(r => r.status === 'PENDIENTE' && r.employeeId !== 'emp001').length}</span>
                </div>
                <div className="bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></span>
                  Total: <span className="font-bold text-slate-900">{filteredRequests.length}</span>
                </div>
              </div>
            </m.div>

            {/* Filters Bar */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Unidad</label>
                  <Select value={filterUnit} onValueChange={setFilterUnit}>
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-2 focus:ring-primary/20"><SelectValue placeholder="Todas" /></SelectTrigger>
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

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Estado</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-slate-50 border-slate-100 h-12 rounded-xl focus:ring-2 focus:ring-primary/20"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="APROBADO">Aprobado</SelectItem>
                      <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Desde</label>
                  <div className="relative">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 block w-full p-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Hasta</label>
                  <div className="relative">
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary/20 block w-full p-3" />
                  </div>
                </div>

                <Button
                  onClick={() => { setFilterUnit("all"); setFilterStatus("all"); setStartDate(""); setEndDate(""); }}
                  className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 border-0 w-full h-12 font-bold rounded-xl transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar
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
                className="h-[420px]"
              >
                <RequestStatusChart
                  requests={filteredRequests}
                  title="Distribución"
                  description="Estado actual"
                  className="rounded-[2rem] border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white"
                />
              </m.div>

              {/* Executive Summary Card */}
              <m.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 p-10 flex flex-col justify-between h-[420px] relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif text-white">Resumen Ejecutivo</h3>
                  </div>

                  <div className="space-y-8 max-w-xl">
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-6xl font-serif text-white">{requests.filter(r => r.status === 'PENDIENTE' && r.employeeId !== 'emp001').length}</span>
                        <span className="text-xl text-white/60 font-medium">solicitudes por revisar</span>
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                        Mantener este número bajo asegura la satisfacción del equipo y la eficiencia operativa.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => setFilterStatus("PENDIENTE")}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-6 rounded-full shadow-lg transition-transform active:scale-95 border-0"
                      >
                        Filtrar Pendientes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setFilterStatus("all"); setFilterUnit("all"); }}
                        className="border-white/20 text-white hover:bg-white/10 py-6 rounded-full px-8 bg-transparent"
                      >
                        Ver Todo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-purple-500/20 to-transparent pointer-events-none"></div>
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"></div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
              </m.div>
            </div>

            {/* Table Container */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/20 border border-slate-50 overflow-hidden px-2 pb-2"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-serif text-xl text-slate-800">Listado de Solicitudes</h3>
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-4 py-2 rounded-full">{filteredRequests.length} registros</span>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow className="hover:bg-transparent border-slate-50">
                      <TableHead className="w-12 pl-8"><Checkbox checked={selectAll} onCheckedChange={handleSelectAll} /></TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider py-6 cursor-pointer" onClick={() => handleSort('id')}>ID</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider py-6 cursor-pointer" onClick={() => handleSort('employeeName')}>Empleado</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider py-6">Unidad</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider py-6">Fechas</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider text-center py-6">Días</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider text-center py-6">Evidencia</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider py-6">Estado</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase text-xs tracking-wider text-right pr-8 py-6">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-40 text-center text-slate-400 font-medium">
                          No hay solicitudes que coincidan con los filtros.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((req, index) => (
                        <TableRow key={req.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors h-20 group">
                          <TableCell className="pl-8">
                            <Checkbox checked={selectedIds.has(req.id)} onCheckedChange={(checked) => handleSelectId(req.id, checked as boolean)} />
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">
                            {req.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                                {req.employeeName.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">{req.employeeName}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">ID: {req.employeeId}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 font-medium text-sm">{req.workSite}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-500 uppercase">Inicio: {req.startDate}</span>
                              <span className="text-xs text-slate-400">Fin: {req.endDate}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm border border-slate-100">{req.totalDays}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {req.evidence ? (
                              <div className="flex justify-center"><CheckCircle className="w-5 h-5 text-teal-400" /></div>
                            ) : (
                              <div className="flex justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div></div>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(req.status)}</TableCell>
                          <TableCell className="text-right pr-8">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReviewingId(req.id)}
                              className="bg-white border border-slate-100 shadow-sm text-slate-600 hover:text-primary hover:border-primary/20 hover:bg-primary/5 font-bold rounded-lg"
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
              className="sticky bottom-6 z-40 bg-white/90 backdrop-blur-xl border border-white/50 p-4 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row gap-6 items-center justify-between mx-4 ring-1 ring-black/5"
            >
              <div className="text-sm font-medium text-slate-600 pl-4">
                {selectedIds.size > 0 ? (
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <span className="flex w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    {selectedIds.size} solicitudes seleccionadas
                  </span>
                ) : (
                  <span className="opacity-50">Seleccione solicitudes para acciones masivas</span>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto pr-2">
                <Button onClick={() => handleBulkAction("approve")} disabled={selectedIds.size === 0} className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20 rounded-full h-12 px-8 font-bold">
                  Aprobar
                </Button>
                <Button onClick={() => handleBulkAction("reject")} disabled={selectedIds.size === 0} className="flex-1 sm:flex-none bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20 rounded-full h-12 px-8 font-bold">
                  Rechazar
                </Button>
                <Button onClick={handlePrintPermits} disabled={selectedIds.size === 0} variant="outline" className="flex-1 sm:flex-none border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full h-12 px-6">
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </m.div>

          </main>
        </div>
      </>
    </LazyMotion>
  )
}
