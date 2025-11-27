"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"

interface LoginPageProps {
  onLogin: (role: "cashier" | "admin") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoadingCashier, setIsLoadingCashier] = useState(false)
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false)

  const getCurrentHour = () => new Date().getHours()
  const shopOpen = 8
  const shopClose = 17 // 5 PM in 24-hour format
  const currentHour = getCurrentHour()
  const isShopOpen = currentHour >= shopOpen && currentHour < shopClose
  const timeUntilOpen = shopOpen - currentHour
  const timeUntilClose = shopClose - currentHour

  const handleLogin = async (role: "cashier" | "admin") => {
    if (role === "cashier") {
      setIsLoadingCashier(true)
    } else {
      setIsLoadingAdmin(true)
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (role === "cashier" && !isShopOpen) {
      if (currentHour < shopOpen) {
        setError(`Shop opens at 8:00 AM. Please return in ${timeUntilOpen} hour(s).`)
      } else {
        setError(`Shop closed at 5:00 PM. Please return tomorrow at 8:00 AM.`)
      }
      setIsLoadingCashier(false)
      return
    }

    const correctPassword = role === "admin" ? "admin123" : "cashier123"
    if (password === correctPassword) {
      onLogin(role)
      setError("")
    } else {
      setError("Invalid password")
      setIsLoadingCashier(false)
      setIsLoadingAdmin(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <img src="/logo.svg" alt="Owoabenes Logo" className="w-24 h-24 mx-auto mb-4" />
          <CardTitle className="text-3xl text-primary">Owoabenes</CardTitle>
          <CardDescription className="text-base">Mothercare & Kids Boutique</CardDescription>
          <p className="text-xs text-muted-foreground mt-2">POS System</p>
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-xs font-semibold text-primary">Shop Hours</p>
            <p className="text-sm text-foreground">8:00 AM - 5:00 PM Daily</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isShopOpen && (
            <div className="flex gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {currentHour < shopOpen
                  ? `Shop opens at 8:00 AM (in ${timeUntilOpen} hour${timeUntilOpen !== 1 ? "s" : ""})`
                  : "Shop is closed. Reopens at 8:00 AM tomorrow"}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === "Enter" && !isLoadingCashier && !isLoadingAdmin && handleLogin("cashier")}
              disabled={isLoadingCashier || isLoadingAdmin}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Button
              onClick={() => handleLogin("cashier")}
              disabled={!isShopOpen || isLoadingCashier || isLoadingAdmin}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed relative h-10"
            >
              {isLoadingCashier ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" variant="accent" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login as Cashier"
              )}
            </Button>
            <Button
              onClick={() => handleLogin("admin")}
              disabled={isLoadingCashier || isLoadingAdmin}
              className="w-full bg-primary hover:bg-primary/90 relative h-10"
            >
              {isLoadingAdmin ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" variant="primary" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login as Admin"
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            <strong>Demo Passwords:</strong>
            <br />
            Cashier: cashier123
            <br />
            Admin: admin123
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
