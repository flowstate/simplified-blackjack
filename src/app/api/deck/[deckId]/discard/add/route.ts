import { NextRequest, NextResponse } from 'next/server';

import { discardCards } from '@/lib/deck/apiDeck';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const { deckId } = params;
  const searchParams = request.nextUrl.searchParams;
  const cardCodes = searchParams.get('codes') ?? '';
  const res = await discardCards(deckId, cardCodes);
  return NextResponse.json(res);
}
