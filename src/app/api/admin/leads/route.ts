import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const password = params.get("password");

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sort = params.get("sort") === "asc" ? true : false;
  const category = params.get("category");
  const status = params.get("status");

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: sort });

  if (category) {
    query = query.eq("software_category", category);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data: leads, error } = await query.limit(500);

  if (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }

  return NextResponse.json({ leads: leads || [] });
}
