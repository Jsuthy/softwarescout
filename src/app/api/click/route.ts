import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tool_slug } = await request.json();

    if (!tool_slug || typeof tool_slug !== "string") {
      return NextResponse.json({ error: "Invalid tool_slug" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent");
    const referer = request.headers.get("referer");
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || null;

    await supabase.from("clicks").insert({
      tool_slug,
      user_agent: userAgent,
      referer: referer,
      ip_address: ip,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
