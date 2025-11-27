import { supabaseServer } from "@/lib/database/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { success: false, error: "Database client not initialized. Check environment variables." },
        { status: 500 },
      )
    }

    const { data, error } = await supabaseServer
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error fetching transactions:", error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { success: false, error: "Database client not initialized. Check environment variables." },
        { status: 500 },
      )
    }

    const transactionData = await request.json()

    if (transactionData.items && Array.isArray(transactionData.items)) {
      for (const item of transactionData.items) {
        if (item.id && item.quantity) {
          // Get current quantity
          const { data: productData, error: fetchError } = await supabaseServer
            .from("products")
            .select("quantity")
            .eq("id", item.id)
            .single()

          if (fetchError) {
            console.error(`[v0] Error fetching product ${item.id}:`, fetchError.message)
            continue
          }

          const currentQuantity = productData?.quantity || 0
          const newQuantity = Math.max(0, currentQuantity - item.quantity)

          const { error: updateErr } = await supabaseServer
            .from("products")
            .update({ quantity: newQuantity })
            .eq("id", item.id)

          if (updateErr) {
            console.error(`[v0] Error updating quantity for product ${item.id}:`, updateErr.message)
          }
        }
      }
    }

    // Insert the transaction record
    const { data, error } = await supabaseServer.from("transactions").insert([transactionData]).select()

    if (error) throw error

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error adding transaction:", error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
