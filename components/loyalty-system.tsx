"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, Search, TrendingUp, Clock } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  totalSpent: number
  loyaltyPoints: number
  purchaseCount: number
  lastPurchase: string
  joinDate: string
}

interface LoyaltySystemProps {
  onCustomerSelect: (customer: Customer) => void
  onApplyDiscount: (discount: number) => void
}

export default function LoyaltySystem({ onCustomerSelect, onApplyDiscount }: LoyaltySystemProps) {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Amina Adeyemi",
      phone: "+234 801 234 5678",
      email: "amina@email.com",
      totalSpent: 125000,
      loyaltyPoints: 1250,
      purchaseCount: 15,
      lastPurchase: "2025-11-20",
      joinDate: "2024-06-15",
    },
    {
      id: "2",
      name: "Chioma Okafor",
      phone: "+234 802 345 6789",
      email: "chioma@email.com",
      totalSpent: 89500,
      loyaltyPoints: 895,
      purchaseCount: 11,
      lastPurchase: "2025-11-18",
      joinDate: "2024-08-20",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [newCustomerPhone, setNewCustomerPhone] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery),
  )

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    onCustomerSelect(customer)
    setShowLoyaltyModal(true)
  }

  const handleRedeemPoints = (pointsToRedeem: number) => {
    if (selectedCustomer && selectedCustomer.loyaltyPoints >= pointsToRedeem) {
      // 100 points = 1% discount
      const discount = (pointsToRedeem / 100) * 1
      onApplyDiscount(discount)

      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? { ...c, loyaltyPoints: c.loyaltyPoints - pointsToRedeem } : c,
        ),
      )

      setSelectedCustomer({
        ...selectedCustomer,
        loyaltyPoints: selectedCustomer.loyaltyPoints - pointsToRedeem,
      })
    }
  }

  const handleAddCustomer = () => {
    if (newCustomerName && newCustomerPhone) {
      const newCustomer: Customer = {
        id: String(customers.length + 1),
        name: newCustomerName,
        phone: newCustomerPhone,
        totalSpent: 0,
        loyaltyPoints: 0,
        purchaseCount: 0,
        lastPurchase: new Date().toISOString().split("T")[0],
        joinDate: new Date().toISOString().split("T")[0],
      }
      setCustomers([...customers, newCustomer])
      setNewCustomerName("")
      setNewCustomerPhone("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-accent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-accent" />
              <CardTitle>Loyalty & Rewards</CardTitle>
            </div>
            <Badge variant="outline" className="bg-accent/10">
              Smart Feature
            </Badge>
          </div>
          <CardDescription>Search customer or create new to earn loyalty points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowLoyaltyModal(true)}
              className="border-accent text-accent hover:bg-accent/10"
            >
              Add Customer
            </Button>
          </div>

          {/* Customer List */}
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-bold text-accent">{customer.loyaltyPoints}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{customer.purchaseCount} purchases</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">No customers found</p>
            )}
          </div>

          {/* New Customer Form */}
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium text-foreground">Create New Customer</p>
            <Input
              placeholder="Customer name"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
            />
            <Input
              placeholder="Phone number"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
            />
            <Button onClick={handleAddCustomer} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Create Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Details Modal */}
      <Dialog open={showLoyaltyModal} onOpenChange={setShowLoyaltyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
            <DialogDescription>Loyalty Account Details</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-accent/10 border-0">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Loyalty Points</p>
                    <p className="text-2xl font-bold text-accent">{selectedCustomer.loyaltyPoints}</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/10 border-0">
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Purchases</p>
                    <p className="text-2xl font-bold text-primary">{selectedCustomer.purchaseCount}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Purchase Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">₦{selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-medium">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last Purchase:
                  </span>
                  <span className="font-medium">{new Date(selectedCustomer.lastPurchase).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Redeem Section */}
              <div className="space-y-2 border-t pt-4">
                <p className="font-medium">Redeem Points</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRedeemPoints(100)}
                    disabled={selectedCustomer.loyaltyPoints < 100}
                    className="text-xs"
                  >
                    100 pts
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRedeemPoints(250)}
                    disabled={selectedCustomer.loyaltyPoints < 250}
                    className="text-xs"
                  >
                    250 pts
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRedeemPoints(500)}
                    disabled={selectedCustomer.loyaltyPoints < 500}
                    className="text-xs"
                  >
                    500 pts
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowLoyaltyModal(false)}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
