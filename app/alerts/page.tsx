"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { AlertTable } from "@/components/AlertTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Settings, Bell, Plus, CheckCircle, Clock } from "lucide-react"

interface Alert {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  timestamp: string
  cameraId: string
  status: "active" | "acknowledged" | "resolved"
  actionTaken: string
  description: string
}

interface AlertRule {
  id: string
  name: string
  type: string
  severity: "low" | "medium" | "high"
  enabled: boolean
  cameras: string[]
  conditions: string
}

export default function AlertsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock alerts data
    const mockAlerts: Alert[] = [
      {
        id: "1",
        type: "Unauthorized Access",
        severity: "high",
        timestamp: new Date().toISOString(),
        cameraId: "CAM-003",
        status: "active",
        actionTaken: "Security notified",
        description: "Attempted access to secure door without authorization",
      },
      {
        id: "2",
        type: "Motion Alert",
        severity: "medium",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        cameraId: "CAM-002",
        status: "acknowledged",
        actionTaken: "Guard dispatched",
        description: "Motion detected in restricted area after hours",
      },
      {
        id: "3",
        type: "Person Detected",
        severity: "low",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        cameraId: "CAM-001",
        status: "resolved",
        actionTaken: "Verified authorized personnel",
        description: "Person detected in lobby area",
      },
      {
        id: "4",
        type: "Suspicious Activity",
        severity: "high",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        cameraId: "CAM-004",
        status: "acknowledged",
        actionTaken: "Investigation ongoing",
        description: "Unusual behavior pattern detected near entrance",
      },
      {
        id: "5",
        type: "Perimeter Breach",
        severity: "high",
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        cameraId: "CAM-005",
        status: "active",
        actionTaken: "Pending response",
        description: "Fence line crossed in restricted zone",
      },
    ]

    // Mock alert rules
    const mockRules: AlertRule[] = [
      {
        id: "1",
        name: "After Hours Motion",
        type: "Motion Detection",
        severity: "medium",
        enabled: true,
        cameras: ["CAM-001", "CAM-002"],
        conditions: "Motion detected between 10 PM - 6 AM",
      },
      {
        id: "2",
        name: "Unauthorized Access",
        type: "Access Control",
        severity: "high",
        enabled: true,
        cameras: ["CAM-003", "CAM-004"],
        conditions: "Access attempt without valid credentials",
      },
      {
        id: "3",
        name: "Loitering Detection",
        type: "Behavioral Analysis",
        severity: "low",
        enabled: false,
        cameras: ["CAM-001"],
        conditions: "Person stationary for > 10 minutes",
      },
      {
        id: "4",
        name: "Perimeter Security",
        type: "Zone Monitoring",
        severity: "high",
        enabled: true,
        cameras: ["CAM-005", "CAM-006"],
        conditions: "Movement detected in restricted perimeter",
      },
    ]

    setAlerts(mockAlerts)
    setAlertRules(mockRules)
    setFilteredAlerts(mockAlerts)
  }, [])

  useEffect(() => {
    let filtered = alerts

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, statusFilter, severityFilter])

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "acknowledged" as const } : alert)))
  }

  const handleResolve = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "resolved" as const } : alert)))
  }

  const toggleRule = (id: string) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const activeAlerts = alerts.filter((alert) => alert.status === "active").length
  const acknowledgedAlerts = alerts.filter((alert) => alert.status === "acknowledged").length
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved").length
  const highSeverityActive = alerts.filter((alert) => alert.status === "active" && alert.severity === "high").length

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4" />
      case "acknowledged":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Alert Management</h1>
              <p className="text-muted-foreground">Monitor and manage security alerts</p>
            </div>
            {highSeverityActive > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {highSeverityActive} Critical Alert{highSeverityActive > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  {activeAlerts > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {activeAlerts}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{activeAlerts}</div>
                <p className="text-xs text-muted-foreground">{highSeverityActive} critical priority</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{acknowledgedAlerts}</div>
                <p className="text-xs text-muted-foreground">Awaiting resolution</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{resolvedAlerts}</div>
                <p className="text-xs text-green-600">Completed today</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Rules</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {alertRules.filter((rule) => rule.enabled).length}
                </div>
                <p className="text-xs text-muted-foreground">of {alertRules.length} total rules</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="alerts" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="alerts">
                Active Alerts
                {activeAlerts > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {activeAlerts}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rules">Alert Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

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

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {filteredAlerts.length} of {alerts.length} alerts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AlertTable alerts={filteredAlerts} onAcknowledge={handleAcknowledge} onResolve={handleResolve} />
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Alert Rules Configuration</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>

              <div className="grid gap-4">
                {alertRules.map((rule) => (
                  <Card key={rule.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                            <p className="text-sm text-muted-foreground">{rule.type}</p>
                          </div>
                          <Badge className={getSeverityColor(rule.severity)} variant="secondary">
                            {rule.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`rule-${rule.id}`} className="text-foreground">
                            Enabled
                          </Label>
                          <Switch
                            id={`rule-${rule.id}`}
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cameras:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {rule.cameras.map((camera) => (
                              <Badge key={camera} variant="outline" className="text-xs">
                                {camera}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conditions:</span>
                          <p className="mt-1 text-foreground">{rule.conditions}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
