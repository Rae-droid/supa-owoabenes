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

    const { data, error } = await supabaseServer.from("products").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error fetching products:", error)
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

    const productData = await request.json()

    if (productData.expiry_date === "") {
      productData.expiry_date = null
    }

    const { data, error } = await supabaseServer.from("products").insert([productData]).select()

    if (error) throw error

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error adding product:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
