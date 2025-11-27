"use client"

import * as React from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProducts() {
  const [data, setData] = React.useState<any>(null)
  const [error, setError] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const res = await fetcher("/api/products")
        setData(res)
        setError(null)
      } catch (err) {
        setError(err)
        console.error("[v0] Error fetching products:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = async (product: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      const result = await res.json()
      const updatedData = await fetcher("/api/products")
      setData(updatedData)
      return result
    } catch (error) {
      console.error("[v0] Error adding product:", error)
      throw error
    }
  }

  const updateProduct = async (id: string, updates: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      const updatedData = await fetcher("/api/products")
      setData(updatedData)
      return res.json()
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      throw error
    }
  }

  return {
    products: data?.data || [],
    isLoading,
    error,
    addProduct,
    updateProduct,
    mutate: () => {}, // placeholder for compatibility
  }
}
