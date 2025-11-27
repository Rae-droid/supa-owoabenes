import { supabaseServer } from "@/lib/database/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[v0] Error fetching staff:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const staffData = await request.json();
    const { data, error } = await supabaseServer
      .from("staff")
      .insert([staffData])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("[v0] Error adding staff:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
