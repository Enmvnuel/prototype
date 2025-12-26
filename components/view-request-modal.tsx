"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RequestData } from "@/context/app-context"
import { X, FileText, User, Calendar, MapPin, Clock, Info } from "lucide-react"

interface ViewRequestModalProps {
    request: RequestData
    onClose: () => void
}

export default function ViewRequestModal({ request, onClose }: ViewRequestModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-60 bg-white border-0 ring-1 ring-white/20 rounded-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-100 flex flex-row items-center justify-between p-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">DETALLE DE SOLICITUD</p>
                        <CardTitle className="text-xl text-slate-900">Referencia: #{request.id}</CardTitle>
                    </div>
                    <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-500">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* Status Header */}
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${request.status === 'APROBADO' ? 'bg-green-500 shadow-green-200' :
                                    request.status === 'RECHAZADO' ? 'bg-red-500 shadow-red-200' : 'bg-yellow-500 shadow-yellow-200'
                                }`}>
                                {request.status === 'APROBADO' ? '✓' : request.status === 'RECHAZADO' ? '✕' : '?'}
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Estado de la Solicitud</p>
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-xl font-bold ${request.status === 'APROBADO' ? 'text-green-600' :
                                            request.status === 'RECHAZADO' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                        {request.status}
                                    </h3>
                                    {request.status === "PENDIENTE" && (
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                                            En Revisión
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Fecha Solicitud</p>
                            <p className="text-slate-700 font-bold">{request.createdAt}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Information Column */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
                                <Info className="w-4 h-4 text-blue-500" />
                                Información General
                            </h4>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Solicitante</p>
                                        <p className="text-sm font-semibold text-slate-700">{request.employeeName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Sede / Ubicación</p>
                                        <p className="text-sm font-semibold text-slate-700">{request.workSite}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Tipo de Permiso</p>
                                        <p className="text-sm font-semibold text-slate-700">{request.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dates & Duration Column */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                Periodo de Tiempo
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Desde</p>
                                    <p className="font-bold text-slate-800">{request.startDate}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Hasta</p>
                                    <p className="font-bold text-slate-800">{request.endDate}</p>
                                </div>
                                <div className="col-span-2 p-5 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-blue-100 text-xs font-bold uppercase opacity-80">Duración Total</p>
                                            <p className="text-2xl font-black">{request.totalDays} Días</p>
                                        </div>
                                        <Clock className="w-8 h-8 opacity-20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observations and Feedback */}
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mis Observaciones</h4>
                            <p className="text-slate-700 text-sm leading-relaxed italic">
                                "{request.observations || 'Sin observaciones adicionales'}"
                            </p>
                        </div>

                        {request.managerNotes && (
                            <div className={`p-6 rounded-2xl border ${request.status === 'RECHAZADO' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                                }`}>
                                <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${request.status === 'RECHAZADO' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    Respuesta del Evaluador
                                </h4>
                                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                    {request.managerNotes}
                                </p>
                                {request.reviewedAt && (
                                    <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold">
                                        Evaluado el: {request.reviewedAt}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                    <Button
                        onClick={onClose}
                        className="px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Entendido
                    </Button>
                </div>
            </Card>
        </div>
    )
}
