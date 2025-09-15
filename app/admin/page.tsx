"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, CameraIcon, ServerIcon, DatabaseIcon, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "operator" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
}

interface Camera {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "maintenance"
  ipAddress: string
  model: string
  rtspUrl: string
  resolution: string
}

interface SystemSettings {
  recordingEnabled: boolean
  alertsEnabled: boolean
  autoArchive: boolean
  retentionDays: number
  maxConcurrentStreams: number
  emailNotifications: boolean
  smsNotifications: boolean
  alertThreshold: number
}

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])
  const [settings, setSettings] = useState<SystemSettings>({
    recordingEnabled: true,
    alertsEnabled: true,
    autoArchive: true,
    retentionDays: 30,
    maxConcurrentStreams: 10,
    emailNotifications: true,
    smsNotifications: false,
    alertThreshold: 0.8,
  })
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Mock users data
    const mockUsers: User[] = [
      {
        id: "1",
        username: "admin",
        email: "admin@surveillance.com",
        role: "admin",
        status: "active",
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        username: "operator1",
        email: "operator1@surveillance.com",
        role: "operator",
        status: "active",
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        username: "viewer1",
        email: "viewer1@surveillance.com",
        role: "viewer",
        status: "inactive",
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "4",
        username: "security_chief",
        email: "chief@surveillance.com",
        role: "admin",
        status: "active",
        lastLogin: new Date(Date.now() - 1800000).toISOString(),
      },
    ]

    // Mock cameras data
    const mockCameras: Camera[] = [
      {
        id: "CAM-001",
        name: "Main Entrance",
        location: "Building A - Entrance",
        status: "online",
        ipAddress: "192.168.1.101",
        model: "HD-2000",
        rtspUrl: "rtsp://192.168.1.101:554/stream",
        resolution: "1080p",
      },
      {
        id: "CAM-002",
        name: "Parking Lot",
        location: "Outdoor - Parking Area",
        status: "online",
        ipAddress: "192.168.1.102",
        model: "HD-2000",
        rtspUrl: "rtsp://192.168.1.102:554/stream",
        resolution: "4K",
      },
      {
        id: "CAM-003",
        name: "Secure Door",
        location: "Building B - Secure Area",
        status: "maintenance",
        ipAddress: "192.168.1.103",
        model: "HD-3000",
        rtspUrl: "rtsp://192.168.1.103:554/stream",
        resolution: "1080p",
      },
      {
        id: "CAM-004",
        name: "Loading Dock",
        location: "Building C - Loading Area",
        status: "offline",
        ipAddress: "192.168.1.104",
        model: "HD-2000",
        rtspUrl: "rtsp://192.168.1.104:554/stream",
        resolution: "720p",
      },
    ]

    setUsers(mockUsers)
    setCameras(mockCameras)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "severity-high"
      case "operator":
        return "severity-medium"
      case "viewer":
        return "severity-low"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "online":
        return "status-online"
      case "inactive":
      case "offline":
        return "status-offline"
      case "maintenance":
        return "status-warning"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const updateSettings = (key: keyof SystemSettings, value: boolean | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleDeleteCamera = (cameraId: string) => {
    setCameras((prev) => prev.filter((camera) => camera.id !== cameraId))
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
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">System Administration</h1>
            <p className="text-muted-foreground">Manage users, cameras, and system settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {users.filter((u) => u.status === "active").length} active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Cameras</CardTitle>
                <CameraIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {cameras.filter((c) => c.status === "online").length}
                </div>
                <p className="text-xs text-muted-foreground">of {cameras.length} total cameras</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
                <ServerIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-green-600">99.8% uptime</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
                <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">2.4TB</div>
                <p className="text-xs text-muted-foreground">of 10TB capacity</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="cameras">Camera Management</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">User Management</h2>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Enter username" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Create User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="text-left p-4 text-foreground font-semibold">User</th>
                          <th className="text-left p-4 text-foreground font-semibold">Role</th>
                          <th className="text-left p-4 text-foreground font-semibold">Status</th>
                          <th className="text-left p-4 text-foreground font-semibold">Last Login</th>
                          <th className="text-left p-4 text-foreground font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr
                            key={user.id}
                            className={`border-b border-border hover:bg-muted/50 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                          >
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-foreground">{user.username}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getRoleColor(user.role)} variant="secondary">
                                {user.role.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(user.status)} variant="secondary">
                                {user.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-4 text-foreground">{new Date(user.lastLogin).toLocaleDateString()}</td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cameras" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Camera Management</h2>
                <Dialog open={isAddCameraOpen} onOpenChange={setIsAddCameraOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Camera
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Camera</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="camera-name">Camera Name</Label>
                        <Input id="camera-name" placeholder="Enter camera name" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="Enter location" />
                      </div>
                      <div>
                        <Label htmlFor="ip">IP Address</Label>
                        <Input id="ip" placeholder="192.168.1.100" />
                      </div>
                      <div>
                        <Label htmlFor="rtsp">RTSP URL</Label>
                        <Input id="rtsp" placeholder="rtsp://192.168.1.100:554/stream" />
                      </div>
                      <Button className="w-full">Add Camera</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {cameras.map((camera) => (
                  <Card key={camera.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{camera.name}</h3>
                          <p className="text-sm text-muted-foreground">{camera.location}</p>
                        </div>
                        <Badge className={getStatusColor(camera.status)} variant="secondary">
                          {camera.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Camera ID:</span>
                          <p className="font-mono text-foreground">{camera.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">IP Address:</span>
                          <p className="font-mono text-foreground">{camera.ipAddress}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Model:</span>
                          <p className="text-foreground">{camera.model}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Resolution:</span>
                          <p className="text-foreground">{camera.resolution}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="text-muted-foreground text-sm">RTSP URL:</span>
                        <p className="font-mono text-sm text-foreground bg-muted p-2 rounded mt-1">{camera.rtspUrl}</p>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCamera(camera.id)}
                          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">System Settings</h2>

              <div className="grid gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recording Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recording" className="text-foreground">
                        Enable Recording
                      </Label>
                      <Switch
                        id="recording"
                        checked={settings.recordingEnabled}
                        onCheckedChange={(checked) => updateSettings("recordingEnabled", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-archive" className="text-foreground">
                        Auto Archive Old Recordings
                      </Label>
                      <Switch
                        id="auto-archive"
                        checked={settings.autoArchive}
                        onCheckedChange={(checked) => updateSettings("autoArchive", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retention" className="text-foreground">
                        Retention Period (days)
                      </Label>
                      <Input
                        id="retention"
                        type="number"
                        value={settings.retentionDays}
                        onChange={(e) => updateSettings("retentionDays", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Alert & Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alerts" className="text-foreground">
                        Enable Alerts
                      </Label>
                      <Switch
                        id="alerts"
                        checked={settings.alertsEnabled}
                        onCheckedChange={(checked) => updateSettings("alertsEnabled", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-notifications" className="text-foreground">
                          Email Notifications
                        </Label>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSettings("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="sms-notifications" className="text-foreground">
                          SMS Notifications
                        </Label>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => updateSettings("smsNotifications", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-foreground">
                        Alert Confidence Threshold
                      </Label>
                      <Input
                        id="threshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.alertThreshold}
                        onChange={(e) => updateSettings("alertThreshold", Number.parseFloat(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Minimum confidence level (0.0 - 1.0) to trigger alerts
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Performance Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="streams" className="text-foreground">
                        Max Concurrent Streams
                      </Label>
                      <Input
                        id="streams"
                        type="number"
                        value={settings.maxConcurrentStreams}
                        onChange={(e) => updateSettings("maxConcurrentStreams", Number.parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">Maximum number of simultaneous video streams</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
