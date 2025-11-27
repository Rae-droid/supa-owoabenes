"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  wholeSalePrice?: number
  wholeSalePriceWithProfit?: number
}

interface ShoppingCartProps {
  items: CartItem[]
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function ShoppingCart({ items, onRemove, onUpdateQuantity }: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-primary">Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-96 overflow-y-auto space-y-2 border-b border-border pb-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-muted p-3 rounded-lg space-y-2">
                {item.image && (
                  <div className="w-full h-16 rounded overflow-hidden bg-background">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₵{item.price.toFixed(2)} (retail)</p>
                    {item.wholeSalePrice && (
                      <p className="text-xs text-green-600">₵{item.wholeSalePrice.toFixed(2)} (wholesale)</p>
                    )}
                  </div>
                  <Button
                    onClick={() => onRemove(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                  >
                    −
                  </Button>
                  <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm font-semibold text-primary">₵{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-bold text-lg border-t border-border pt-2 text-primary">
            <span>Total:</span>
            <span>₵{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
