import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // 1. Update NordVPN description and features
  console.log("--- Updating NordVPN ---");
  const { error: e1 } = await supabase
    .from("tools")
    .update({
      description:
        "NordVPN is the leading VPN service with 8,400+ servers across 165 locations worldwide, delivering top-tier speed and security. Connect up to 10 devices per account with advanced threat protection, double VPN encryption, and an audited no-logs policy.",
      features: [
        "8,400+ servers across 165 locations",
        "Up to 10 devices per account",
        "Threat Protection Pro (malware, trackers, ads)",
        "Kill Switch for always-on privacy",
        "Double VPN for extra encryption",
        "Meshnet for secure private networking",
        "Split tunneling",
        "Dedicated IP option",
      ],
    })
    .eq("slug", "nordvpn");

  if (e1) console.error("NordVPN update error:", e1.message);
  else console.log("NordVPN updated successfully");

  // 2. Insert NordProtect as a new tool in the cybersecurity category
  // First check if a cybersecurity category exists, if not use vpn
  console.log("\n--- Inserting NordProtect ---");

  // Check if cybersecurity category exists
  const { data: cats } = await supabase
    .from("categories")
    .select("slug")
    .in("slug", ["cybersecurity", "identity-theft-protection", "security"]);

  let categorySlug = "vpn"; // fallback
  if (cats && cats.length > 0) {
    categorySlug = cats[0].slug;
  }
  console.log("Using category:", categorySlug);

  const { error: e2 } = await supabase.from("tools").upsert(
    {
      slug: "nordprotect",
      name: "NordProtect",
      description:
        "NordProtect is an all-in-one identity theft protection service from Nord Security. It provides 3-bureau credit monitoring, 24/7 dark web surveillance, criminal records scanning across 2,800+ U.S. jails, and up to $1M in identity theft recovery insurance — plus $50K cyber extortion and $10K online fraud coverage.",
      logo_url:
        "https://www.google.com/s2/favicons?domain=nordprotect.com&sz=128",
      website_url: "https://nordprotect.com",
      affiliate_link:
        "https://go.nordprotect.net/aff_c?offer_id=973&aff_id=140794&url_id=31982",
      category_slug: categorySlug,
      features: [
        "3-bureau credit monitoring (Experian, Equifax, TransUnion)",
        "24/7 dark web monitoring",
        "Criminal records monitoring across 2,800+ U.S. jails",
        "Up to $1M identity theft recovery insurance",
        "Up to $50K cyber extortion insurance",
        "Up to $10K online fraud reimbursement",
        "Financial account monitoring",
        "Credit lock via TransUnion",
        "Malware breach alerts",
        "Short-term loan monitoring",
      ],
      pros: [
        "Comprehensive 3-bureau credit monitoring at competitive pricing",
        "Generous $1M identity theft insurance coverage",
        "24/7 dark web surveillance with actionable alerts",
        "Backed by trusted Nord Security brand",
        "30-day money-back guarantee",
      ],
      cons: [
        "Currently available only in the U.S.",
        "No free tier available",
        "Newer service compared to established competitors like LifeLock",
      ],
      pricing_starts_at: 4.49,
      pricing_tiers: [
        {
          name: "Silver",
          price: "$4.49/mo",
          features: [
            "Dark web monitoring",
            "Credit monitoring",
            "Security alerts",
          ],
        },
        {
          name: "Gold",
          price: "$7.49/mo",
          features: [
            "All Silver features",
            "Enhanced alerts",
            "Identity recovery support",
          ],
        },
        {
          name: "Platinum",
          price: "$10.99/mo",
          features: [
            "All Gold features",
            "$1M identity theft insurance",
            "$50K cyber extortion coverage",
            "$10K online fraud reimbursement",
          ],
        },
      ],
    },
    { onConflict: "slug" }
  );

  if (e2) console.error("NordProtect insert error:", e2.message);
  else console.log("NordProtect inserted successfully");

  // 3. Verify all three tools
  console.log("\n--- Verification ---");
  const { data: tools } = await supabase
    .from("tools")
    .select("slug, name, description, affiliate_link, features")
    .in("slug", ["nordvpn", "nordpass", "nordprotect"]);

  for (const t of tools || []) {
    console.log(`\n${t.name}:`);
    console.log(`  Description: ${t.description?.slice(0, 80)}...`);
    console.log(`  Affiliate: ${t.affiliate_link}`);
    console.log(`  Features: ${t.features?.length} total`);
  }
}

main().catch(console.error);
