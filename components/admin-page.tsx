"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import LoadingSpinner from "@/components/loading-spinner"

interface Transaction {
  id: string
  date: string
  total: number
  itemCount: number
  items: Array<{ name: string; quantity: number; price: number; cost_price?: number }>
  discount: number
  paymentMethod: string
  customerName?: string
  amountReceived?: number
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  wholesale_price: number
  wholesale_price_with_profit: number
  quantity: number
  image?: string
  brand_name: string
  expiry_date: string
  created_at: string
  description: string
  min_stock: number
}

interface Staff {
  id: string
  name: string
  role: string
  email: string
  join_date: string
}

interface AdminPageProps {
  onLogout: () => void
}

export default function AdminPage({ onLogout }: AdminPageProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  const [products, setProducts] = useState<Product[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [productSearch, setProductSearch] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchStaff()
    fetchTransactions()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const res = await fetch("/api/products")
      const result = await res.json()
      if (result.success) {
        setProducts(result.data || [])
      } else {
        console.error("[v0] fetchProducts response error:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const fetchStaff = async () => {
    try {
      setIsLoadingStaff(true)
      const res = await fetch("/api/staff")
      const result = await res.json()
      if (result.success) {
        setStaff(result.data || [])
      } else {
        console.error("[v0] fetchStaff response error:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching staff:", error)
    } finally {
      setIsLoadingStaff(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true)
      const res = await fetch("/api/transactions")
      const result = await res.json()
      if (result.success) {
        const formattedTransactions =
          result.data?.map((t: any) => ({
            id: t.id,
            // keep the raw ISO timestamp so new Date(...) works reliably later
            date: t.created_at,
            total: t.total,
            itemCount: t.items?.length || 0,
            items: t.items || [],
            discount: t.discount || 0,
            paymentMethod: t.payment_method || "cash",
            customerName: t.customer_name,
            amountReceived: t.amount_received,
          })) || []
        setTransactions(formattedTransactions)
      } else {
        console.error("[v0] fetchTransactions response error:", result.error)
      }
    } catch (error) {
      console.error("[v0] Error fetching transactions:", error)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "",
    wholesale_price: 0,
    wholesale_price_with_profit: 0,
    quantity: 0,
    min_stock: 0,
    brand_name: "",
    expiry_date: "",
    description: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newStaff, setNewStaff] = useState({ name: "", role: "", email: "" })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setNewProduct({ ...newProduct, image: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async () => {
    if (
      newProduct.name &&
      newProduct.category &&
      newProduct.wholesale_price !== undefined &&
      newProduct.wholesale_price_with_profit !== undefined &&
      newProduct.quantity !== undefined
    ) {
      setIsAddingProduct(true)
      const productData = {
        ...newProduct,
        price: newProduct.wholesale_price,
        quantity: newProduct.quantity || 0,
        min_stock: newProduct.min_stock || 0,
      }

      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
        const result = await res.json()

        if (result.success) {
          setProducts([...products, result.data])
          setNewProduct({
            name: "",
            category: "",
            wholesale_price: 0,
            wholesale_price_with_profit: 0,
            quantity: 0,
            min_stock: 0,
            brand_name: "",
            expiry_date: "",
            description: "",
            image: "",
          })
          setImagePreview(null)
          setShowAddProduct(false)
          console.log("[v0] Product added successfully")
        } else {
          console.error("[v0] Error adding product:", result.error)
          alert("Failed to add product: " + (result.error || "Unknown error"))
        }
      } catch (error) {
        console.error("[v0] Error adding product:", error)
        alert("Error adding product: " + (error instanceof Error ? error.message : String(error)))
      } finally {
        setIsAddingProduct(false)
      }
    } else {
      alert("Please fill in all required product fields.")
    }
  }

  const handleAddStaff = async () => {
    if (newStaff.name && newStaff.role && newStaff.email) {
      setIsAddingStaff(true)
      const staffData = {
        name: newStaff.name,
        role: newStaff.role,
        email: newStaff.email,
        join_date: new Date().toISOString().split("T")[0],
      }

      try {
        const res = await fetch("/api/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(staffData),
        })
        const result = await res.json()

        if (result.success) {
          await fetchStaff()
          setNewStaff({ name: "", role: "", email: "" })
          setShowAddStaff(false)
          setActiveTab("staff")
          console.log("[v0] Staff added successfully")
        } else {
          console.error("[v0] Error adding staff:", result.error)
          alert("Failed to add staff: " + (result.error || "Unknown error"))
        }
      } catch (error) {
        console.error("[v0] Error adding staff:", error)
        alert("Error adding staff: " + (error instanceof Error ? error.message : String(error)))
      } finally {
        setIsAddingStaff(false)
      }
    } else {
      alert("Please fill in all staff fields.")
    }
  }

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  // ---------- FIXED DELETE FUNCTION ----------
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setDeletingProductId(productId)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      // Attempt to parse response carefully:
      // - If 204 No Content => treat as success when res.ok
      // - If content-type application/json => parse and inspect
      // - Otherwise attempt a safe text parse or fallback to res.ok
      let parsed: any = null
      const contentType = res.headers.get("content-type")

      if (res.status === 204) {
        // No content response — treat as success if res.ok
        parsed = { success: res.ok }
      } else if (contentType && contentType.includes("application/json")) {
        try {
          parsed = await res.json()
        } catch (err) {
          console.warn("[v0] Failed to parse JSON delete response:", err)
          parsed = { success: res.ok }
        }
      } else {
        // Try to read text and attempt JSON.parse; otherwise fallback to ok
        try {
          const text = await res.text()
          parsed = text ? JSON.parse(text) : { success: res.ok }
        } catch (err) {
          // not JSON
          parsed = { success: res.ok }
        }
      }

      if (res.ok && parsed && parsed.success) {
        // Remove from UI
        setProducts((prev) => prev.filter((product) => product.id !== productId))
        console.log("[v0] Product deleted successfully")
      } else {
        const serverMsg = parsed && parsed.error ? parsed.error : parsed && parsed.message ? parsed.message : "Unknown error"
        console.error("[v0] Error deleting product:", serverMsg)
        alert("Failed to delete product: " + serverMsg)
      }
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      alert("Error deleting product: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setDeletingProductId(null)
    }
  }
  // -------------------------------------------

  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalProfit = transactions.reduce((sum, transaction) => {
    const transactionProfit = transaction.items.reduce((itemSum, item) => {
      const profitPerUnit = (item.price || 0) - (item.cost_price || 0)
      const itemProfit = profitPerUnit * (item.quantity || 0)
      return itemSum + itemProfit
    }, 0)
    return sum + transactionProfit
  }, 0)

  const lowStockProducts = products.filter((p) => p.quantity <= p.min_stock && p.quantity > 0)
  const outOfStockProducts = products.filter((p) => p.quantity === 0)

  const paymentMethodStats = {
    cash: transactions.filter((t) => t.paymentMethod === "cash").length,
    card: transactions.filter((t) => t.paymentMethod === "card").length,
    momo: transactions.filter((t) => t.paymentMethod === "momo").length,
    check: transactions.filter((t) => t.paymentMethod === "check").length,
  }

  const stats = {
    totalTransactions: transactions.length,
    totalRevenue: totalRevenue.toFixed(2),
    averageTransaction: (totalRevenue / Math.max(transactions.length, 1)).toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    totalItemsSold: transactions.reduce(
      (sum, t) => sum + (t.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0),
      0,
    ),
  }

  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase()
    if (!q) return true
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand_name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/noback.png" alt="Logo" className="w-14 h-14" />
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Owoabenes Mothercare & Kids Boutique</p>
            </div>
          </div>
          <Button onClick={onLogout} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{stats.totalTransactions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">GHS {stats.totalRevenue}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Total Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">GHS {stats.totalProfit}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">Average Sale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">GHS {stats.averageTransaction}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Cash</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{paymentMethodStats.cash}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-secondary">{paymentMethodStats.card}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Mobile Money</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-accent">{paymentMethodStats.momo}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{paymentMethodStats.check}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">Items Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.totalItemsSold}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-600">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
                  <p className="text-xs text-muted-foreground mt-2">Products below minimum stock</p>
                </CardContent>
              </Card>
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-sm text-destructive">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">{outOfStockProducts.length}</p>
                  <p className="text-xs text-muted-foreground mt-2">Products with 0 units</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-sm text-destructive">Out of Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">{outOfStockProducts.length}</p>
                  <p className="text-xs text-muted-foreground mt-2">Products with 0 units</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {products.map((product) => {
                    const isEmpty = product.quantity === 0
                    return (
                      <div
                        key={product.id}
                        className={`flex justify-between items-center p-3 rounded border ${
                          isEmpty ? "border-destructive/50 bg-destructive/5" : "bg-muted"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.category} • {product.brand_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isEmpty ? "text-destructive" : "text-primary"}`}>
                            {product.quantity} units
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Button onClick={() => setShowAddProduct(!showAddProduct)} className="bg-primary hover:bg-primary/90">
                    {showAddProduct ? "Cancel" : "+ Add Product"}
                  </Button>
                </div>
              </CardHeader>
              {showAddProduct && (
                <CardContent className="space-y-4 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Product Name</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., Samsung Galaxy S21</p>
                      <Input
                        placeholder="Enter product name"
                        value={newProduct.name || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Category</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., Electronics</p>
                      <Select
                        value={newProduct.category || ""}
                        onValueChange={(val) => setNewProduct({ ...newProduct, category: val })}
                      >
                        <SelectTrigger disabled={isAddingProduct}>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Wholesale Price</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., 150.00</p>
                      <Input
                        placeholder="Enter wholesale price"
                        type="text"
                        value={newProduct.wholesale_price || ""}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, wholesale_price: Number.parseFloat(e.target.value) || 0 })
                        }
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Wholesale Price + Profit</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., 200.00</p>
                      <Input
                        placeholder="Enter selling price"
                        type="text"
                        value={newProduct.wholesale_price_with_profit || ""}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            wholesale_price_with_profit: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Quantity</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., 50</p>
                      <Input
                        placeholder="Enter quantity"
                        type="text"
                        value={newProduct.quantity || ""}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) || 0 })
                        }
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Minimum Stock</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., 10</p>
                      <Input
                        placeholder="Enter minimum stock level"
                        type="text"
                        value={newProduct.min_stock || ""}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, min_stock: Number.parseInt(e.target.value) || 0 })
                        }
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Brand Name</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., Samsung</p>
                      <Input
                        placeholder="Enter brand name"
                        value={newProduct.brand_name || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, brand_name: e.target.value })}
                        disabled={isAddingProduct}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Expiry Date</label>
                      <p className="text-xs text-muted-foreground mb-2">e.g., 2025-12-31</p>
                      <Input
                        placeholder="Select expiry date"
                        type="date"
                        value={newProduct.expiry_date || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, expiry_date: e.target.value })}
                        disabled={isAddingProduct}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <p className="text-xs text-muted-foreground mb-2">
                      e.g., High-quality smartphone with 5G support, excellent camera, long battery life
                    </p>
                    <Textarea
                      placeholder="Enter product description"
                      className="w-full p-2 border rounded"
                      value={newProduct.description || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      disabled={isAddingProduct}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                      disabled={isAddingProduct}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-24 w-24 object-cover rounded"
                      />
                    )}
                  </div>
                  <Button
                    onClick={handleAddProduct}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isAddingProduct}
                  >
                    {isAddingProduct ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" variant="primary" />
                        <span>Adding Product...</span>
                      </div>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search products by name, brand or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoadingProducts ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" variant="primary" label="Loading products..." />
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        {product.image && (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <CardContent className="p-4">
                          <p className="font-bold text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand_name}</p>
                          <p className="text-xs text-muted-foreground mb-2">Stock: {product.quantity}</p>
                          <div className="space-y-1 text-xs">
                            <p>
                              <span className="font-semibold">Wholesale:</span> GHS {product.wholesale_price}
                            </p>
                            <p>
                              <span className="font-semibold">Wholesale + Profit:</span> GHS{" "}
                              {product.wholesale_price_with_profit}
                            </p>
                            <p>
                              <span className="font-semibold">Profit/Unit:</span> GHS{" "}
                              {(product.wholesale_price_with_profit - product.wholesale_price).toFixed(2)}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="mt-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            disabled={deletingProductId === product.id}
                          >
                            {deletingProductId === product.id ? (
                              <div className="flex items-center gap-2">
                                <LoadingSpinner size="sm" variant="destructive" />
                                <span>Deleting...</span>
                              </div>
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No products found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-4">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Staff Management</CardTitle>
                  <Button onClick={() => setShowAddStaff(!showAddStaff)} className="bg-primary hover:bg-primary/90">
                    {showAddStaff ? "Cancel" : "+ Add Staff"}
                  </Button>
                </div>
              </CardHeader>
              {showAddStaff && (
                <CardContent className="space-y-4 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Staff Name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      disabled={isAddingStaff}
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      disabled={isAddingStaff}
                    />
                    <Select value={newStaff.role} onValueChange={(val) => setNewStaff({ ...newStaff, role: val })}>
                      <SelectTrigger disabled={isAddingStaff}>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddStaff}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isAddingStaff}
                  >
                    {isAddingStaff ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" variant="primary" />
                        <span>Adding Staff...</span>
                      </div>
                    ) : (
                      "Add Staff"
                    )}
                  </Button>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {isLoadingStaff ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" variant="secondary" label="Loading staff..." />
                    </div>
                  ) : staff.length > 0 ? (
                    staff.map((member) => (
                      <div key={member.id} className="flex justify-between items-center p-3 bg-muted rounded">
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{member.role}</p>
                          <p className="text-xs text-muted-foreground">Joined: {member.join_date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No staff members found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Transaction Search</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by ID or Customer Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingTransactions ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" variant="accent" label="Loading transactions..." />
                    </div>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                      const profit = transaction.items.reduce((total, item) => {
                        const itemProfit = ((item.price || 0) - (item.cost_price || 0)) * (item.quantity || 0)
                        return total + Math.max(0, itemProfit)
                      }, 0)

                      return (
                        <Card
                          key={transaction.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Receipt ID</p>
                                <p className="font-semibold">{transaction.id}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Customer</p>
                                <p className="font-semibold">{transaction.customerName || "Walk-in"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-semibold">GHS {transaction.total?.toFixed(2) || "0.00"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Profit</p>
                                <p className="font-semibold text-green-600">GHS {profit.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Payment</p>
                                <p className="font-semibold">{transaction.paymentMethod}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <p className="text-muted-foreground">No transactions found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedTransaction && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Receipt Number</p>
                      <p className="font-semibold">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customer Name</p>
                      <p className="font-semibold">{selectedTransaction.customerName || "Walk-in"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold">GHS {selectedTransaction.total?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Method</p>
                      <p className="font-semibold">{selectedTransaction.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-semibold">
                        {new Date(selectedTransaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cashier</p>
                      <p className="font-semibold">Benedicta Sarpong</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time:</p>
                      <p className="font-semibold">
                        {new Date(selectedTransaction.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount Received</p>
                      <p className="font-semibold">GHS {selectedTransaction.amountReceived?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className="font-semibold text-green-600">
                        GHS{" "}
                        {selectedTransaction.items
                          .reduce((total, item) => {
                            const itemProfit = ((item.price || 0) - (item.cost_price || 0)) * (item.quantity || 0)
                            return total + Math.max(0, itemProfit)
                          }, 0)
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedTransaction.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × GHS {item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">GHS {(item.quantity * item.price).toFixed(2)}</p>
                            <p className="text-xs text-green-600">
                              Profit: GHS{((item.price - (item.cost_price || 0)) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
