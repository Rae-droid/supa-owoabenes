"use client"

import * as React from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useTransactions() {
  const [data, setData] = React.useState<any>(null)
  const [error, setError] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const res = await fetcher("/api/transactions")
        setData(res)
        setError(null)
      } catch (err) {
        setError(err)
        console.error("[v0] Error fetching transactions:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const addTransaction = async (transaction: any) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })
      const result = await res.json()
      const updatedData = await fetcher("/api/transactions")
      setData(updatedData)
      return result
    } catch (error) {
      console.error("[v0] Error adding transaction:", error)
      throw error
    }
  }

  return {
    transactions: data?.data || [],
    isLoading,
    error,
    addTransaction,
    mutate: () => {}, // placeholder for compatibility
  }
}
