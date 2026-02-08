import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ tools: [] });
  }

  const searchTerm = `%${q}%`;

  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order("name")
    .limit(50);

  return NextResponse.json({ tools: tools || [] });
}
