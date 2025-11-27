import { supabaseServer } from "@/lib/database/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Invalid items format" }, { status: 400 })
    }

    for (const item of items) {
      const { data: product } = await supabaseServer
        .from("products")
        .select("id, quantity")
        .eq("name", item.name)
        .single()

      if (product) {
        const newQuantity = Math.max(0, product.quantity - item.quantity)
        await supabaseServer.from("products").update({ quantity: newQuantity }).eq("id", product.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error updating stock:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
