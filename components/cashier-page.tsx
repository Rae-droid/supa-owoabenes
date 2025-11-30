"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ProductGrid from "@/components/product-grid"
import ShoppingCartComponent from "@/components/shopping-cart"
import ReceiptComponent from "@/components/receipt"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "./loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTransactions } from "@/lib/hooks/useTransactions"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
  wholeSalePrice?: number
  wholeSalePriceWithProfit?: number
  subtotal: number
  cost_price?: number // Added cost_price field
}

interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  timestamp: string
  cashierName: string
  customerName: string
  paymentMethod: string
}

interface CashierPageProps {
  onAddTransaction: (transaction: any) => void
  onLogout: () => void
}

export default function CashierPage({ onAddTransaction, onLogout }: CashierPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [activeTab, setActiveTab] = useState("sales")
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false)
  const [amountReceived, setAmountReceived] = useState("")
  const [isLogoutEnabled, setIsLogoutEnabled] = useState(false)
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [lastTransaction, setLastTransaction] = useState<CartItem[]>([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [showCheckoutPanel, setShowCheckoutPanel] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash")
  const [receiptCustomerName, setReceiptCustomerName] = useState("")
  const [receiptAmountReceived, setReceiptAmountReceived] = useState(0)
  const [paymentError, setPaymentError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const receiptRef = useRef<any>(null)

  const {
    transactions: dbTransactions,
    addTransaction: addTransactionToDB,
    mutate: mutateTransactions,
  } = useTransactions()

  useEffect(() => {
    mutateTransactions()
  }, [])

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.wholesale_price_with_profit,
          quantity: 1,
          category: product.category,
          image: product.image,
          wholeSalePrice: product.wholesale_price,
          wholeSalePriceWithProfit: product.wholesale_price_with_profit,
          subtotal: product.wholesale_price_with_profit,
          cost_price: product.wholesale_price, // Added cost_price field
        },
      ]
    })

    // Refetch products to update stock display
    setTimeout(() => {
      const productGrid = document.querySelector("[data-product-grid]")
      if (productGrid) {
        fetch("/api/products")
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.data) {
              // Trigger ProductGrid refetch by updating a ref or state
              window.dispatchEvent(new CustomEvent("productsNeedRefresh", { detail: result.data }))
            }
          })
          .catch((err) => console.error("[v0] Error refetching products:", err))
      }
    }, 100)
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity, subtotal: item.price * quantity } : item)),
      )
    }
  }

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!")
      return
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
    const discountAmount = (subtotal * discountPercentage) / 100
    const totalAmount = subtotal - discountAmount

    setReceiptCustomerName(customerName)
    setReceiptAmountReceived(Number.parseFloat(amountReceived) || 0)
    setShowPaymentConfirm(true)
  }

  const resetCart = () => {
    setCartItems([])
    setDiscountPercentage(0)
    setCustomerName("")
    setAmountReceived("")
  }

  const handleCompleteCheckout = async () => {
    setIsProcessing(true)
    try {
      const transactionSubtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
      const transactionDiscount = (transactionSubtotal * discountPercentage) / 100
      const transactionTotal = transactionSubtotal - transactionDiscount

      setReceiptCustomerName(customerName || "Walk-in Customer")
      setReceiptAmountReceived(Number(amountReceived) || 0)

      const transactionData = {
        items: cartItems.map((item) => ({
          ...item,
          cost_price: item.wholeSalePrice, // Store wholesale price as cost for profit calculations
        })),
        subtotal: transactionSubtotal,
        discount: transactionDiscount,
        total: transactionTotal,
        payment_method: selectedPaymentMethod,
        customer_name: customerName || "Walk-in Customer",
        amount_received: Number(amountReceived),
        change: Number(amountReceived) - transactionTotal,
        receipt_number: `RCP-${Date.now()}`,
      }

      await addTransactionToDB(transactionData)

      setLastTransaction(cartItems)
      setShowPaymentConfirm(false)
      setShowReceipt(true)
      resetCart()
      setPaymentError("")
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      setPaymentError("An error occurred during checkout")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML)
        printWindow.document.close()
        printWindow.print()
        setShowReceipt(false)
      }
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discountPercentage) / 100
  const totalAmount = subtotal - discountAmount

  useEffect(() => {
    const checkLogoutTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // Enable logout only at 5pm (17:00) or later
      setIsLogoutEnabled(hours >= 17)
    }

    // Check immediately on mount
    checkLogoutTime()

    // Check every minute if logout should be enabled
    const interval = setInterval(checkLogoutTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatPaymentMethod = (method: string) => {
    const methods: { [key: string]: string } = {
      cash: "Cash",
      card: "Card",
      momo: "Mobile Money",
      check: "Check",
    }
    return methods[method] || method
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header with company name and logout button */}
      <div className="flex items-center justify-between bg-white border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/noback.png" alt="Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-primary">Owoabenes</h1>
            <p className="text-xs text-muted-foreground">Mothercare & Kids Boutique</p>
          </div>
        </div>
        <div className="relative group">
          <Button
            onClick={onLogout}
            disabled={!isLogoutEnabled}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isLogoutEnabled ? "Logout available at 5:00 PM" : ""}
          >
            Logout
          </Button>
          {!isLogoutEnabled && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Available at 5:00 PM
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* LEFT SIDE - Products Grid (takes full width on mobile, 2 cols on desktop) */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          {/* Analytics Header */}

          {/* Products Grid - scrollable */}
          <div className="flex-1 overflow-y-auto" data-product-grid>
            <ProductGrid onAddToCart={addToCart} />
          </div>
        </div>

        {/* RIGHT SIDE - Enhanced Sidebar with Tabs (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex lg:flex-col lg:w-80 gap-4 flex-1 overflow-hidden">
          {/* Tabs for organizing sidebar content */}
          <Tabs defaultValue="checkout" className="w-full flex flex-col flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 bg-muted flex-shrink-0">
              <TabsTrigger value="checkout" className="text-xs">
                Checkout
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">
                Stats
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">
                Recent
              </TabsTrigger>
            </TabsList>

            {/* CHECKOUT TAB */}
            <TabsContent value="checkout" className="flex flex-col flex-1 overflow-hidden space-y-0 min-h-0">
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {/* Customer Info Card */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent flex-shrink-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-primary/70 uppercase tracking-wide">
                      👤 Customer Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter customer name (optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="text-sm border-primary/30 focus:border-primary"
                    />
                  </CardContent>
                </Card>

                {/* Shopping Cart */}
                <div className="flex-shrink-0">
                  <ShoppingCartComponent
                    items={cartItems}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                </div>

                {/* Order Summary - always flows naturally with scroll */}
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 space-y-2.5 border border-accent/20 flex-shrink-0">
                  <div className="flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wide">
                    <span>Order Summary</span>
                    <span className="text-[10px] font-semibold">({cartItems.length} items)</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₵{subtotal.toFixed(2)}</span>
                    </div>
                    {discountPercentage > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-950/20 px-2 py-1 rounded">
                        <span>Discount ({discountPercentage}%)</span>
                        <span className="font-semibold">-₵{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total Amount */}
                  <div className="border-t border-accent/30 pt-2.5 flex justify-between items-center bg-gradient-to-r from-primary/20 to-transparent px-2 py-2 rounded">
                    <span className="font-bold text-primary">Total</span>
                    <span className="text-xl font-bold text-primary">₵{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Discount & Payment - flows naturally with rest of content */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Discount %</label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) =>
                          setDiscountPercentage(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))
                        }
                        placeholder="0"
                        className="text-sm h-9 text-center"
                      />
                      <span className="text-xs font-semibold text-muted-foreground">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Payment</label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger className="text-sm h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">💵 Cash</SelectItem>
                        <SelectItem value="card">💳 Card</SelectItem>
                        <SelectItem value="momo">📱 Momo</SelectItem>
                        <SelectItem value="check">📋 Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checkout Button - stays at end of scroll */}
                <Button
                  onClick={handleCheckoutClick}
                  disabled={cartItems.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold py-5 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" variant="primary" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>💰 Proceed to Payment</span>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* STATS TAB - New advanced stats view */}
            <TabsContent value="stats" className="space-y-4">
              <Card className="border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-600">Today's Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="text-lg font-bold text-primary">{dbTransactions.length}</p>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-bold text-green-600">
                        ₵{dbTransactions.reduce((sum: number, t: any) => sum + (t.total || 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <p className="text-xs text-muted-foreground">Average Sale</p>
                    <p className="text-lg font-bold text-accent">
                      ₵
                      {(dbTransactions.length > 0
                        ? dbTransactions.reduce((sum: number, t: any) => sum + (t.total || 0), 0) /
                          dbTransactions.length
                        : 0
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-muted p-2 rounded">
                    <p className="text-xs text-muted-foreground">Items Sold</p>
                    <p className="text-lg font-bold text-primary">
                      {dbTransactions.reduce((sum: number, t: any) => sum + (t.items?.length || 0), 0)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-purple-600">Top Sellers Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(() => {
                      const productSales: any = {}
                      dbTransactions.forEach((t: any) => {
                        if (t.items && Array.isArray(t.items)) {
                          t.items.forEach((item: any) => {
                            productSales[item.name] = (productSales[item.name] || 0) + item.quantity
                          })
                        }
                      })
                      return Object.entries(productSales)
                        .sort(([, a]: any, [, b]: any) => b - a)
                        .slice(0, 5)
                        .map(([name, quantity]: any) => (
                          <div key={name} className="flex justify-between text-xs bg-muted p-2 rounded">
                            <span className="truncate">{name}</span>
                            <span className="font-bold text-primary">{quantity}x</span>
                          </div>
                        ))
                    })()}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* RECENT TAB - New recent transactions view */}
            <TabsContent value="recent" className="space-y-4 overflow-y-auto">
              <Card className="border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-600">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {dbTransactions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No transactions yet</p>
                    ) : (
                      dbTransactions
                        .slice()
                        .reverse()
                        .slice(0, 10)
                        .map((transaction: any, idx: number) => (
                          <div key={idx} className="bg-muted p-2 rounded border-l-2 border-green-600">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-foreground">
                                  {transaction.customer_name || "Walk-in"}
                                </p>
                                <p className="text-xs text-muted-foreground">{transaction.items?.length || 0} items</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {new Date(transaction.timestamp || transaction.created_at).toLocaleTimeString()}{" "}
                                  {new Date(transaction.timestamp || transaction.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-green-600">₵{(transaction.total || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Checkout Button - visible only on mobile, sticky at bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-primary/20 gap-3 flex">
          <Button onClick={() => setShowCheckoutPanel(!showCheckoutPanel)} variant="outline" className="flex-1">
            {showCheckoutPanel ? "Hide" : "Show"} Cart
          </Button>
          <Button
            onClick={handleCheckoutClick}
            disabled={cartItems.length === 0 || isProcessing}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold"
          >
            {isProcessing ? <LoadingSpinner size="sm" variant="primary" /> : "Checkout"}
          </Button>
        </div>

        {/* Mobile Checkout Panel Overlay */}
        {showCheckoutPanel && (
          <div className="lg:hidden fixed inset-0 top-0 bg-black/50 z-40" onClick={() => setShowCheckoutPanel(false)} />
        )}
        {showCheckoutPanel && (
          <div className="lg:hidden fixed inset-0 top-0 z-50 flex items-end">
            <div className="w-full bg-background rounded-t-lg p-4 max-h-[80vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={() => setShowCheckoutPanel(false)} className="text-2xl">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-primary/20 rounded-lg border bg-muted p-3">
                  <h3 className="text-sm font-semibold text-primary mb-3">Customer Info</h3>
                  <Input
                    placeholder="Customer name (optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <ShoppingCartComponent items={cartItems} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />

                <div className="border-secondary/20 rounded-lg border bg-muted p-3">
                  <h3 className="text-sm font-semibold text-secondary mb-3">Discount & Payment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block">Discount (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) =>
                          setDiscountPercentage(Math.max(0, Math.min(100, Number.parseFloat(e.target.value) || 0)))
                        }
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>

                    <div className="bg-background p-3 rounded-lg border-l-4 border-primary">
                      <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                      <p className="text-xl font-bold text-primary">₵{totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPaymentConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-2xl border border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20 rounded-t-lg">
                <CardTitle className="text-2xl text-primary">💳 Payment Confirmation</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Review and complete your payment</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {/* Amount Summary Box */}
                <div className="space-y-3 bg-gradient-to-br from-muted/50 to-muted/30 p-4 rounded-lg border border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₵{subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount ({discountPercentage}%)</span>
                      <span className="font-semibold">-₵{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg text-primary">
                    <span>Total Due</span>
                    <span className="text-2xl">₵{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Amount Received Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Amount Received</label>
                  <Input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="0.00"
                    className="text-lg font-semibold border-primary/30 focus:border-primary h-12"
                  />
                </div>

                {/* Change Display */}
                {amountReceived && Number.parseFloat(amountReceived) >= totalAmount && (
                  <div className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30">
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1 font-semibold uppercase tracking-wide">
                      Change Due
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ₵{(Number.parseFloat(amountReceived) - totalAmount).toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {paymentError && (
                  <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded border border-red-200/50 dark:border-red-800/30">
                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold">⚠️ {paymentError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowPaymentConfirm(false)}
                    variant="outline"
                    className="flex-1 border-border/50 hover:bg-muted"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCompleteCheckout}
                    disabled={!amountReceived || Number.parseFloat(amountReceived) < totalAmount || isProcessing}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-5"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "✓ Complete Payment"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Receipt Modal */}
        {showReceipt && lastTransaction.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-screen overflow-y-auto flex flex-col">
              <CardHeader className="bg-primary/10 border-b border-primary/20 flex-shrink-0">
                <CardTitle className="text-primary">Receipt</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1 overflow-y-auto flex flex-col">
                <div ref={receiptRef} className="flex-1">
                  <ReceiptComponent
                    items={lastTransaction}
                    discount={
                      (lastTransaction.reduce((sum, item) => sum + item.subtotal, 0) * discountPercentage) / 100
                    }
                    customerName={receiptCustomerName}
                    cashierName="Benedicta Sarpong"
                    amountReceived={receiptAmountReceived}
                    change={receiptAmountReceived - totalAmount}
                    paymentMethod={formatPaymentMethod(selectedPaymentMethod)}
                  />
                </div>
                <div className="flex gap-3 mt-6 flex-shrink-0">
                  <Button onClick={() => setShowReceipt(false)} variant="outline" className="flex-1">
                    Close
                  </Button>
                  <Button onClick={handlePrint} className="flex-1 bg-primary hover:bg-primary/90">
                    🖨️ Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
