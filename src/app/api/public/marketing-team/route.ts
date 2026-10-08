import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { MarketingTeamMember } from "@/models/MarketingTeamMember";

export async function GET() {
  try {
    await dbConnect();
    const members = await MarketingTeamMember.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("Error fetching marketing team:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch marketing team" }, { status: 500 });
  }
}
