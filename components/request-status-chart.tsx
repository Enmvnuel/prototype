"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RequestData } from "@/context/app-context"
import { cn } from "@/lib/utils"

interface RequestStatusChartProps {
    requests: RequestData[]
    title?: string
    description?: string
    className?: string
}

export default function RequestStatusChart({ requests, title = "Resumen de Solicitudes", description, className }: RequestStatusChartProps) {
    const data = useMemo(() => {
        const counts = {
            APROBADO: 0,
            RECHAZADO: 0,
            PENDIENTE: 0,
        }

        requests.forEach((req) => {
            if (req.status in counts) {
                counts[req.status as keyof typeof counts]++
            }
        })

        // Order: Aprobado (green), Pendiente (yellow), Rechazado (red)
        // This ensures the chart segments appear in the same order as the legend
        return [
            { name: "Aprobado", value: counts.APROBADO, color: "#10b981" }, // emerald-500
            { name: "Pendiente", value: counts.PENDIENTE, color: "#facc15" }, // yellow-400
            { name: "Rechazado", value: counts.RECHAZADO, color: "#ef4444" }, // red-500
        ].filter((item) => item.value > 0)
    }, [requests])

    const total = requests.length

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-sm">
                    <p className="font-bold text-slate-700 mb-1">{payload[0].name}</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></span>
                        <span className="text-slate-500 font-medium">{payload[0].value} solicitudes</span>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Card className={cn("h-full shadow-sm border-slate-200 overflow-hidden flex flex-col", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-800">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 min-h-[250px] relative flex items-center justify-center p-6">
                {total === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-2xl">?</span>
                        </div>
                        <p className="text-sm font-medium">Sin datos registrados</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={6}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        strokeWidth={0}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        const { cx, cy } = viewBox as any
                                        return (
                                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                                                <tspan x={cx} y={cy - 5} className="fill-slate-900 text-4xl font-extrabold tracking-tight" style={{ fontSize: '32px' }}>
                                                    {total}
                                                </tspan>
                                                <tspan x={cx} y={cy + 20} className="fill-slate-500 text-[10px] uppercase font-bold tracking-widest">
                                                    TOTAL
                                                </tspan>
                                            </text>
                                        )
                                    }}
                                />
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ paddingTop: '24px', fontSize: '13px', fontWeight: 500, color: '#64748b' }}
                                formatter={(value) => <span className="text-slate-600 ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
