// Updated Receipt component WITHOUT Tailwind
// Uses ONLY inline styles + custom CSS for perfect POS printing

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
  customerPhone?: number
  discount?: number
  paymentMethod?: string
  amountReceived?: number
}

interface ReceiptComponentProps {
  items: CartItem[]
  discount: number
  customerName: string
  customerPhone?: string // <-- Add this line
  cashierName: string
  amountReceived: number
  change: number
  paymentMethod: string
}

export default function ReceiptComponent({
  items,
  discount,
  customerName,
  customerPhone, // <-- Add this line
  cashierName,
  amountReceived,
  change,
  paymentMethod,
}: ReceiptComponentProps) {
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
  const calculatedChange = numAmountReceived - total

  return (
    <div>
      <div
        id="receipt-content"
        style={{
          width: "105mm",
          margin: "0 auto",
          background: "white",
          fontFamily: "monospace",
          fontSize: "17px",
          padding: "8mm",
          color: "black",
          lineHeight: "1.4",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <img src="/back.jpeg" alt="Logo" style={{ width: "120px", height: "120px", objectFit: "contain", fontWeight: "bold" }} />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", borderBottom: "2px solid black", paddingBottom: "6px", marginBottom: "6px" }}>
          <div style={{ fontWeight: "bold", fontSize: "15px" }}>OWOABENES</div>
          <div>Mothercare & Kids Boutique</div>
          <div>Children's Products 0-18 Years</div>

          
          

        </div>

        {/* Transaction Details */}
        <div style={{ borderBottom: "1px dashed black", paddingBottom: "6px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Receipt #:</span><span>{receiptNumber}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Date:</span><span>{now.toLocaleDateString()}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Time:</span><span>{now.toLocaleTimeString()}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Cashier:</span><span style={{ fontWeight: "bold" }}>Benedicta Sarpong</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Customer:</span><span>{customerName || "No Name"}</span></div>
          {<div style={{ display: "flex", justifyContent: "space-between" }}><span>Phone:</span><span>{customerPhone || "No Phone"}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Payment:</span><span>{paymentMethod}</span></div>
          
        </div>

        {/* Items */}
        <div style={{ borderBottom: "1px dashed black", paddingBottom: "6px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", borderBottom: "1px solid black", paddingBottom: "4px", marginBottom: "4px" }}>
            <span>Item</span><span>Qty</span><span>Price</span><span>Total</span>
          </div>

          {items.map((item) => {
            const priceToUse = item.wholeSalePriceWithProfit || item.price
            return (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ width: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                <span>{item.quantity}</span>
                <span>₵{priceToUse.toFixed(2)}</span>
                <span style={{ fontWeight: "bold" }}>₵{(priceToUse * item.quantity).toFixed(2)}</span>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div style={{ borderBottom: "1px dashed black", paddingBottom: "6px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal:</span><span>₵{subtotal.toFixed(2)}</span></div>
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Cost:</span><span>₵{totalCost.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}><span>Profit:</span><span>₵{totalProfit.toFixed(2)}</span></div> */}

          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span>Discount ({discount}%):</span>
              <span>-₵{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "bold", marginTop: "6px", borderTop: "1px solid black", paddingTop: "4px" }}>
            <span>TOTAL:</span>
            <span>₵{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div style={{ borderBottom: "1px dashed black", paddingBottom: "6px", marginBottom: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Amount Received:</span><span>₵{numAmountReceived.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "4px" }}><span>Change:</span><span>₵{Math.max(0, calculatedChange).toFixed(2)}</span></div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <div style={{fontWeight: "bold"}}>Tel: 0549241991/ 0548048520</div>
          <div>Thank you for your purchase!</div>
          <div>Please visit us again</div>
          <div style={{ fontWeight: "bold", marginTop: "6px" }}>*** END OF RECEIPT ***</div>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          #receipt-content {
            width: 80mm !important;
            padding: 8mm !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}

// PRINT FUNCTION
export function printReceipt() {
  // Only run in the browser
  if (typeof window === "undefined") return

  const content = document.getElementById("receipt-content")?.innerHTML
  if (!content) return

  const printWindow = window.open("", "_blank", "width=400,height=600")
  if (!printWindow) return

  printWindow.document.open()
  printWindow.document.write(`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt</title>
        <style>
          body { margin: 0; font-family: monospace; width: 80mm; }
          #print-area { width: 80mm; padding: 8mm; font-size: 10px; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        </style>
      </head>
      <body>
        <div id='print-area'>${content}</div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `)

  printWindow.document.close()
}
