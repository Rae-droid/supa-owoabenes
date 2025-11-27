"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { AlertCircle } from "lucide-react"

interface SalesAnalyticsProps {
  transactions: any[]
  products: any[]
}

export default function SalesAnalytics({ transactions, products }: SalesAnalyticsProps) {
  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const averageTransaction = totalRevenue / Math.max(transactions.length, 1)

  // Get hourly sales data
  const hourlyData: { [key: number]: number } = {}
  transactions.forEach((t) => {
    const hour = new Date(t.timestamp).getHours()
    hourlyData[hour] = (hourlyData[hour] || 0) + t.total
  })

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    revenue: hourlyData[i] || 0,
  }))

  // Top products by revenue
  const productRevenue: { [key: string]: number } = {}
  transactions.forEach((t) => {
    t.items.forEach((item: any) => {
      productRevenue[item.name] = (productRevenue[item.name] || 0) + item.subtotal
    })
  })

  const topProductsData = Object.entries(productRevenue)
    .map(([name, revenue]) => ({ name, value: revenue as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const COLORS = ["#8b6f47", "#b8956a", "#d4a574", "#e8c4a0", "#f0dcc4"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Today's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₵{averageTransaction.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.reduce((sum, t) => sum + t.items.length, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total items</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Revenue by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8b6f47" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Sellers</CardTitle>
            <CardDescription>Revenue by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8b6f47"
                  dataKey="value"
                >
                  {topProductsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle>Low Stock Alerts</CardTitle>
          </div>
          <CardDescription>Products that need restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products
              .filter((p) => p.stock < 5)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-red-200 dark:border-red-800"
                >
                  <span className="font-medium text-sm">{product.name}</span>
                  <span className="text-xs font-semibold text-red-600">{product.stock} remaining</span>
                </div>
              ))}
            {products.filter((p) => p.stock < 5).length === 0 && (
              <p className="text-sm text-muted-foreground">No low stock alerts</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
