import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[v0] Supabase environment variables are missing! Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.",
  )
}

// Client for browser (use anon key)
export const supabaseBrowser = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase browser client unavailable - missing environment variables")
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
})()

// Server client (use service role key - only on server)
export const supabaseServer = (() => {
  if (!supabaseUrl) {
    console.error("[v0] Cannot create Supabase server client - NEXT_PUBLIC_SUPABASE_URL is missing")
    return null
  }
  const key = supabaseServiceKey || supabaseAnonKey
  if (!key) {
    console.error("[v0] Cannot create Supabase server client - no valid API key available")
    return null
  }
  return createClient(supabaseUrl, key)
})()

export async function addTransactionToDB(transactionData: any) {
  if (!supabaseServer) {
    throw new Error("Supabase server client not initialized")
  }
  const { data, error } = await supabaseServer
    .from('transactions')
    .insert([
      {
        customer_name: transactionData.customer_name,
        customer_phone: transactionData.customer_phone, // <-- Already here
        subtotal: transactionData.subtotal,
        discount: transactionData.discount,
        total: transactionData.total,
        payment_method: transactionData.payment_method,
        amount_received: transactionData.amount_received,
        change: transactionData.change, // <-- Already here
        receipt_number: transactionData.receipt_number, // <-- Already here
        items: transactionData.items,
      }
    ])
  if (error) {
    throw error
  }
  return data
}
