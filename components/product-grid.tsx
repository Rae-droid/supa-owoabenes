"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import LoadingSpinner from "@/components/loading-spinner"

interface Product {
  id: string
  name: string
  price: number
  wholesale_price: number
  wholesale_price_with_profit: number
  category: string
  image?: string
  brand_name?: string
  quantity: number
}

interface ProductGridProps {
  onAddToCart: (product: any) => void
}

const FALLBACK_PRODUCTS = [
  // Newborn (0-3 months)
  {
    id: "1",
    name: "Baby Diaper Pack",
    price: 15.99,
    wholesale_price: 10.99,
    wholesale_price_with_profit: 12.99,
    category: "Diapers",
    brand_name: "BabyDry",
    quantity: 50,
  },
  {
    id: "2",
    name: "Newborn Clothing Set",
    price: 24.99,
    wholesale_price: 17.99,
    wholesale_price_with_profit: 20.99,
    category: "Clothing",
    brand_name: "MomsCare",
    quantity: 30,
  },
  {
    id: "3",
    name: "Baby Bottle Set",
    price: 18.5,
    wholesale_price: 12.99,
    wholesale_price_with_profit: 15.49,
    category: "Feeding",
    brand_name: "FeedRight",
    quantity: 40,
  },
]

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products from database instead of using hardcoded list
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const result = await res.json()
      if (result.success && result.data && result.data.length > 0) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [...new Set(products.map((p) => p.category))]
  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const hasStock = p.quantity > 0
    return matchesCategory && matchesSearch && hasStock
  })

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader className="pb-1 pt-1.5">
          <CardTitle className="text-xs">Search Products</CardTitle>
        </CardHeader>
        <CardContent className="pb-1">
          <Input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 text-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-1.5">
          <CardTitle className="text-xs">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pb-1">
          <div className="flex flex-wrap gap-1.5">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={`text-[10px] h-6 px-2 ${selectedCategory === null ? "bg-primary hover:bg-primary/90" : ""}`}
              size="sm"
            >
              All Products
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`text-[10px] h-6 px-2 ${
                  selectedCategory === cat ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : ""
                }`}
                size="sm"
              >
                {cat}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" variant="primary" label="Loading products..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
              {/* Product Image */}
              <div className="relative w-full h-48 bg-muted overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg?height=192&width=192&query=product"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="text-xs">{product.brand_name || product.category}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-grow flex flex-col">
                <div className="space-y-2 bg-muted p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Wholesale Price:</span>
                    <span className="font-bold text-primary">₵{product.wholesale_price?.toFixed(2) || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">WS + Profit:</span>
                    <span className="text-sm font-medium text-green-600">
                      ₵{product.wholesale_price_with_profit?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Stock:</span>
                    <span className="text-sm font-bold text-blue-600">{product.quantity}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <Button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No products found matching your search or category.</p>
        </Card>
      )}
    </div>
  )
}
