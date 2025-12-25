"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { LogOut, Plus } from "lucide-react"

interface EmployeeDashboardProps {
  onCreateRequest: () => void
  onLogout: () => void
}

export default function EmployeeDashboard({ onCreateRequest, onLogout }: EmployeeDashboardProps) {
  const { requests, getEmployeeBalance } = useAppContext()
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const employeeId = "emp001"
  const balance = getEmployeeBalance(employeeId)

  const employeeRequests = requests.filter((r) => r.employeeId === employeeId)

  const filteredRequests = useMemo(() => {
    return employeeRequests.filter((req) => {
      if (filterMonth !== "all") {
        const reqMonth = req.createdAt.substring(0, 7)
        if (reqMonth !== filterMonth) return false
      }
      if (filterStatus !== "all" && req.status !== filterStatus) return false
      return true
    })
  }, [employeeRequests, filterMonth, filterStatus])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDIENTE: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pendiente" },
      APROBADO: { bg: "bg-green-100", text: "text-green-800", label: "Aprobado" },
      RECHAZADO: { bg: "bg-red-100", text: "text-red-800", label: "Rechazado" },
    }
    const variant = variants[status] || variants.PENDIENTE
    return <Badge className={`${variant.bg} ${variant.text} border-0`}>{variant.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sistema de Gestión de Licencias</h1>
            <p className="text-sm text-slate-600 mt-1">Bienvenido, Nombre del Empleado</p>
          </div>
          <Button onClick={onLogout} variant="ghost" className="text-slate-600 hover:text-slate-900">
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Vacaciones Acumuladas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{balance.vacation} días</div>
              <p className="text-sm text-green-100">Última actualización: Marzo 05</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tiempo Compensatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{balance.compensatory} días</div>
              <p className="text-sm text-blue-100">Última actualización: Marzo 05</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Request Button */}
        <div className="mb-6">
          <Button onClick={onCreateRequest} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Solicitud
          </Button>
        </div>

        {/* Filters and Table */}
        <Card className="shadow-md">
          <CardHeader className="bg-slate-100 border-b border-slate-200">
            <CardTitle className="text-lg">Cuadrícula de Datos del Historial de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Filters */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Mes/Año</label>
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los meses</SelectItem>
                    <SelectItem value="2025-12">Diciembre 2025</SelectItem>
                    <SelectItem value="2025-11">Noviembre 2025</SelectItem>
                    <SelectItem value="2025-10">Octubre 2025</SelectItem>
                    <SelectItem value="2025-09">Septiembre 2025</SelectItem>
                    <SelectItem value="2025-08">Agosto 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="APROBADO">Aprobado</SelectItem>
                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-slate-700 font-semibold">ID Solicitud</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Fecha de Envío</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Tipo de Licencia</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Fechas Solicitadas</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Días Totales</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Sede de Trabajo</TableHead>
                    <TableHead className="text-slate-700 font-semibold">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No hay solicitudes que coincidan con los filtros
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-blue-600">{req.id}</TableCell>
                        <TableCell>{req.createdAt}</TableCell>
                        <TableCell>{req.type}</TableCell>
                        <TableCell>
                          {req.startDate} al {req.endDate}
                        </TableCell>
                        <TableCell className="text-center">{req.totalDays}</TableCell>
                        <TableCell>{req.workSite}</TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredRequests.length > 0 && (
              <p className="text-sm text-slate-600 mt-4">
                Mostrando {filteredRequests.length} de {employeeRequests.length} registros
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
