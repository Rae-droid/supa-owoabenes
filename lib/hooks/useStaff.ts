"use client"

import * as React from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useStaff() {
  const [data, setData] = React.useState<any>(null)
  const [error, setError] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true)
        const res = await fetcher("/api/staff")
        setData(res)
        setError(null)
      } catch (err) {
        setError(err)
        console.error("[v0] Error fetching staff:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStaff()
  }, [])

  const addStaff = async (staffMember: any) => {
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffMember),
      })
      const result = await res.json()
      const updatedData = await fetcher("/api/staff")
      setData(updatedData)
      return result
    } catch (error) {
      console.error("[v0] Error adding staff:", error)
      throw error
    }
  }

  return {
    staff: data?.data || [],
    isLoading,
    error,
    addStaff,
    mutate: () => {}, // placeholder for compatibility
  }
}
