import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const gameId = req.nextUrl.searchParams.get("gameId");
  if (!gameId) {
    return NextResponse.json({ error: "missing gameId" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.collegefootballdata.com/metrics/wp?gameId=${gameId}`,
    { headers: { Authorization: `Bearer ${process.env.CFBD_API_KEY}` } }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
