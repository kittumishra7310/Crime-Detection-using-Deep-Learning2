"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { HistoryTimeline } from "@/components/HistoryTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, CalendarIcon, FileText, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"

interface HistoryItem {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  timestamp: string
  cameraId: string
  confidence: number
  description: string
}

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [cameraFilter, setCameraFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"timeline" | "table">("table")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const mockHistory: HistoryItem[] = [
      {
        id: "1",
        type: "Person Detected",
        severity: "medium",
        timestamp: new Date().toISOString(),
        cameraId: "CAM-001",
        confidence: 0.92,
        description: "Person detected in restricted area during off-hours",
      },
      {
        id: "2",
        type: "Motion Alert",
        severity: "low",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        cameraId: "CAM-002",
        confidence: 0.78,
        description: "Motion detected in parking area",
      },
      {
        id: "3",
        type: "Unauthorized Access",
        severity: "high",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        cameraId: "CAM-003",
        confidence: 0.95,
        description: "Attempted access to secure door without authorization",
      },
      {
        id: "4",
        type: "Vehicle Detected",
        severity: "low",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        cameraId: "CAM-004",
        confidence: 0.88,
        description: "Vehicle parked in designated area",
      },
      {
        id: "5",
        type: "Suspicious Activity",
        severity: "high",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        cameraId: "CAM-001",
        confidence: 0.91,
        description: "Unusual behavior pattern detected near entrance",
      },
      {
        id: "6",
        type: "Face Recognition",
        severity: "medium",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        cameraId: "CAM-002",
        confidence: 0.87,
        description: "Unknown person identified at main entrance",
      },
      {
        id: "7",
        type: "Perimeter Breach",
        severity: "high",
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        cameraId: "CAM-005",
        confidence: 0.94,
        description: "Fence line crossed in restricted zone",
      },
    ]

    setHistoryItems(mockHistory)
    setFilteredItems(mockHistory)
  }, [])

  useEffect(() => {
    let filtered = historyItems

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cameraId.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((item) => item.severity === severityFilter)
    }

    // Apply camera filter
    if (cameraFilter !== "all") {
      filtered = filtered.filter((item) => item.cameraId === cameraFilter)
    }

    if (dateRange.from) {
      filtered = filtered.filter((item) => new Date(item.timestamp) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((item) => new Date(item.timestamp) <= dateRange.to!)
    }

    setFilteredItems(filtered)
  }, [historyItems, searchTerm, severityFilter, cameraFilter, dateRange])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "severity-high"
      case "medium":
        return "severity-medium"
      case "low":
        return "severity-low"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const exportToCSV = () => {
    const headers = ["Timestamp", "Detection Type", "Confidence", "Camera", "Severity", "Description"]
    const csvContent = [
      headers.join(","),
      ...filteredItems.map((item) =>
        [
          new Date(item.timestamp).toLocaleString(),
          `"${item.type}"`,
          `${(item.confidence * 100).toFixed(1)}%`,
          item.cameraId,
          item.severity,
          `"${item.description}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `surveillance-history-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Mock PDF export - in real implementation, use a library like jsPDF
    alert("PDF export functionality would be implemented here using a library like jsPDF")
  }

  const uniqueCameras = Array.from(new Set(historyItems.map((item) => item.cameraId)))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Detection History</h1>
            <p className="text-muted-foreground">View and analyze past detection events</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search detections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={cameraFilter} onValueChange={setCameraFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by camera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cameras</SelectItem>
                    {uniqueCameras.map((camera) => (
                      <SelectItem key={camera} value={camera}>
                        {camera}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        "Pick a date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "timeline" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("timeline")}
                    className="flex-1"
                  >
                    Timeline
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="flex-1"
                  >
                    Table
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {historyItems.length} detections
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {viewMode === "timeline" ? (
            <HistoryTimeline items={filteredItems} />
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-foreground font-semibold">Detection Type</th>
                        <th className="text-left p-4 text-foreground font-semibold">Severity</th>
                        <th className="text-left p-4 text-foreground font-semibold">Camera</th>
                        <th className="text-left p-4 text-foreground font-semibold">Confidence</th>
                        <th className="text-left p-4 text-foreground font-semibold">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-border hover:bg-muted/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-foreground">{item.type}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getSeverityColor(item.severity)} variant="secondary">
                              {item.severity.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-4 text-foreground font-mono">{item.cameraId}</td>
                          <td className="p-4 text-foreground">
                            <div className="flex items-center">
                              <div className="w-16 bg-muted rounded-full h-2 mr-2">
                                <div
                                  className="bg-accent h-2 rounded-full"
                                  style={{ width: `${item.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{(item.confidence * 100).toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-foreground">
                            <div className="font-medium">{format(new Date(item.timestamp), "MMM dd, yyyy")}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(item.timestamp), "HH:mm:ss")}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No detections found matching your filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
