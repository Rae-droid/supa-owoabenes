import { supabaseServer } from "@/lib/database/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("DELETE API called")
  
  try {
    const body = await request.json()
    console.log("Request body received")
    
    if (!supabaseServer) {
      console.error("Supabase not initialized")
      return NextResponse.json(
        { success: false, error: "Database client not initialized" },
        { status: 500 }
      )
    }

    const { productId, productData, deletedBy = "Admin", reason = "No reason provided" } = body

    if (!productId || !productData) {
      console.error("Missing required fields")
      return NextResponse.json(
        { success: false, error: "Missing required fields: productId and productData" },
        { status: 400 }
      )
    }

    console.log("Attempting to delete from products table...")
    
    // First, delete from products table
    const { error: deleteError } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", productId)

    console.log("Delete from products - error:", deleteError)

    if (deleteError) {
      console.error("Error deleting from products:", deleteError)
      return NextResponse.json(
        { success: false, error: `Failed to delete from products: ${deleteError.message}` },
        { status: 500 }
      )
    }

    console.log("Attempting to insert into deleted_products table...")
    
    // Then, save to deleted_products table
    const { error: archiveError } = await supabaseServer
      .from("deleted_products")
      .insert({
        product_id: productId,
        product_name: productData.name || "Unknown Product",
        product_data: productData,
        deleted_by: deletedBy,
        reason: reason
      })

    console.log("Insert into deleted_products - error:", archiveError)

    if (archiveError) {
      console.error("Error archiving to deleted_products:", archiveError)
      return NextResponse.json(
        { success: false, error: `Failed to archive: ${archiveError.message}` },
        { status: 500 }
      )
    }

    console.log("Success! Product deleted and archived")
    return NextResponse.json({ 
      success: true, 
      message: "Product deleted and archived successfully"
    })
  } catch (error: any) {
    console.error("[v0] Error in delete product API:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  console.log("GET deleted products API called")
  
  try {
    if (!supabaseServer) {
      return NextResponse.json(
        { success: false, error: "Database client not initialized" },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseServer
      .from("deleted_products")
      .select("*")
      .order("deleted_at", { ascending: false })

    if (error) {
      console.error("Error fetching deleted products:", error)
      throw error
    }

    console.log("Fetched deleted products:", data?.length || 0)
    return NextResponse.json({ success: true, data: data || [] })
  } catch (error: any) {
    console.error("[v0] Error fetching deleted products:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}