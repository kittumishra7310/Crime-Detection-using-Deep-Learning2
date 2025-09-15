"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Set mock user data regardless of token validity for testing
    setUser({
      id: "1",
      username: "test-user",
      role: "administrator",
    })

    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  }
}
