"use client"

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("studyflow_current_user")
  return userData ? JSON.parse(userData) : null
}

export function logout() {
  localStorage.removeItem("studyflow_current_user")
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
