import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(link.url);
}
