import { supabaseServer } from "@/lib/database/supabase"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const body = await request.text()
    let parsed
    try {
      parsed = JSON.parse(body)
    } catch (e) {
      console.error("Invalid JSON:", body)
      return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 })
    }
    const { deletedProductId, productData } = parsed
    if (!deletedProductId || !productData) {
      return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 })
    }

    // Insert product back into products table
    const { error: insertError } = await supabaseServer
      .from("products")
      .insert([productData])

    if (insertError) throw insertError

    // Remove product from deleted_products table
    const { error: deleteError } = await supabaseServer
      .from("deleted_products")
      .delete()
      .eq("product_id", deletedProductId)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Restore error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}