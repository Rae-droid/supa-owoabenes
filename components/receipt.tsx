"use client"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  wholeSalePrice?: number
  wholeSalePriceWithProfit?: number
}

interface ReceiptProps {
  items: CartItem[]
  customerName?: string
  discount?: number
  paymentMethod?: string
  amountReceived?: number
}

export default function Receipt({
  items,
  customerName = "",
  discount = 0,
  paymentMethod = "cash",
  amountReceived = 0,
}: ReceiptProps) {
  // Calculate total using only wholesale price + profit
  const subtotal = items.reduce((sum, item) => {
    const priceToUse = item.wholeSalePriceWithProfit || item.price
    return sum + priceToUse * item.quantity
  }, 0)

  const totalCost = items.reduce((sum, item) => {
    const wholesalePrice = item.wholeSalePrice || 0
    return sum + wholesalePrice * item.quantity
  }, 0)

  const totalProfit = subtotal - totalCost

  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount
  const now = new Date()
  const receiptNumber = Math.floor(Math.random() * 1000000)

  const numAmountReceived = Number(amountReceived) || 0
  const change = numAmountReceived - total

  return (
    <div
      id="receipt-content"
      className="w-80 mx-auto text-xs font-mono text-black bg-white p-4"
      style={{
        width: "80mm",
        margin: "0 auto",
        padding: "8mm",
        fontSize: "10px",
        lineHeight: "1.4",
      }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-2" style={{ pageBreakInside: "avoid" }}>
        <img src="/logo.svg" alt="Logo" className="w-20 h-20" style={{ maxWidth: "100%" }} />
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2 mb-2" style={{ pageBreakInside: "avoid" }}>
        <h2 className="text-sm font-bold">OWOABENES</h2>
        <p className="text-xs">Mothercare & Kids Boutique</p>
        <p className="text-xs">Children's Products 0-18 Years</p>
      </div>

      {/* Transaction Details */}
      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs" style={{ pageBreakInside: "avoid" }}>
        <div className="flex justify-between">
          <span>Receipt #:</span>
          <span>{receiptNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{now.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Time:</span>
          <span>{now.toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier:</span>
          <span className="font-bold">Benedicta Sarpong</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span className="font-bold">{customerName || "Walk-in Customer"}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment:</span>
          <span className="capitalize">{paymentMethod}</span>
        </div>
      </div>

      {/* Items with Wholesale Price + Profit Only */}
      <div className="border-b border-dashed border-black pb-2 mb-2">
        <div className="flex justify-between border-b border-black pb-1 mb-1 text-xs font-bold">
          <span>Item</span>
          <span>Qty</span>
          <span>Price+Profit</span>
          <span>Total</span>
        </div>
        {items.map((item) => {
          const priceToUse = item.wholeSalePriceWithProfit || item.price
          return (
            <div
              key={item.id}
              className="flex justify-between text-xs mb-2"
              style={{ pageBreakInside: "avoid", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              <span className="flex-1">{item.name}</span>
              <span className="w-8 text-right">{item.quantity}</span>
              <span className="w-16 text-right">₵{priceToUse.toFixed(2)}</span>
              <span className="w-16 text-right font-semibold">₵{(priceToUse * item.quantity).toFixed(2)}</span>
            </div>
          )
        })}
      </div>

      {/* Totals with Profit Breakdown */}
      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs" style={{ pageBreakInside: "avoid" }}>
        <div className="flex justify-between">
          <span>Subtotal (Revenue):</span>
          <span>₵{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Total Cost:</span>
          <span>₵{totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-700 font-semibold">
          <span>Total Profit:</span>
          <span>₵{totalProfit.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-orange-700 border-t border-dashed border-black pt-1 mt-1">
            <span>Discount ({discount}%):</span>
            <span>-₵{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-black">
          <span>TOTAL:</span>
          <span>₵{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs" style={{ pageBreakInside: "avoid" }}>
        <div className="flex justify-between">
          <span>Amount Received:</span>
          <span className="font-bold">₵{numAmountReceived.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-green-700 pt-1">
          <span>Change:</span>
          <span>₵{Math.max(0, change).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs mt-2" style={{ pageBreakInside: "avoid" }}>
        <p className="mb-1">Thank you for your purchase!</p>
        <p className="text-xs">Please visit us again</p>
        <p className="mt-2 text-black font-bold">*** END OF RECEIPT ***</p>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          #receipt-content {
            width: 80mm !important;
            max-width: 80mm;
            margin: 0 !important;
            padding: 8mm !important;
            box-shadow: none;
            page-break-after: avoid;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}
