// API service for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  }

  async getLiveDetection() {
    const response = await fetch(`${API_BASE_URL}/api/detection/live`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async getHistory() {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }

  async getAlerts() {
    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      headers: this.getAuthHeaders(),
    })
    return response.json()
  }
}

export const apiService = new ApiService()
