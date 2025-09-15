"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendData {
  time: string
  detections: number
  alerts: number
}

interface TrendChartProps {
  data: TrendData[]
  title: string
}

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Line type="monotone" dataKey="detections" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Detections" />
            <Line type="monotone" dataKey="alerts" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Alerts" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
