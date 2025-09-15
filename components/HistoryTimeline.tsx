"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react"

interface HistoryItem {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  timestamp: string
  cameraId: string
  confidence: number
  description: string
}

interface HistoryTimelineProps {
  items: HistoryItem[]
}

export function HistoryTimeline({ items }: HistoryTimelineProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const groupItemsByDate = (items: HistoryItem[]) => {
    const groups: { [key: string]: HistoryItem[] } = {}
    items.forEach((item) => {
      const date = new Date(item.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
    })
    return groups
  }

  const groupedItems = groupItemsByDate(items)

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([date, dateItems]) => (
        <div key={date}>
          <h3 className="text-lg font-semibold text-slate-100 mb-4 sticky top-0 bg-slate-900 py-2">{date}</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

            <div className="space-y-4">
              {dateItems.map((item, index) => (
                <div key={item.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-100">{item.type}</h4>
                        <Badge className={getSeverityColor(item.severity)}>
                          {getSeverityIcon(item.severity)}
                          <span className="ml-1 capitalize">{item.severity}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Camera: {item.cameraId}</span>
                        <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
