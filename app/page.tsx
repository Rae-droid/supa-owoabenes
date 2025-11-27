"use client"

import { useState } from "react"
import CashierPage from "@/components/cashier-page"
import AdminPage from "@/components/admin-page"
import LoginPage from "@/components/login-page"

type UserRole = "cashier" | "admin" | null

interface Transaction {
  id: string
  date: string
  total: number
  itemCount: number
  items: Array<{ name: string; quantity: number; price: number }>
  discount: number
  paymentMethod: string
  customerName?: string
}

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([...transactions, newTransaction])
  }

  if (!userRole) {
    return <LoginPage onLogin={setUserRole} />
  }

  if (userRole === "cashier") {
    return <CashierPage onLogout={() => setUserRole(null)} onAddTransaction={handleAddTransaction} />
  }

  return <AdminPage onLogout={() => setUserRole(null)} transactions={transactions} />
}
