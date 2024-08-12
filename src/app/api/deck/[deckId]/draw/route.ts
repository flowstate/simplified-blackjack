import { NextRequest, NextResponse } from 'next/server';

import { drawCards, DrawCardsResponse } from '@/lib/deck/apiDeck';

// opt out of caching
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const { deckId } = params;
  const searchParams = request.nextUrl.searchParams;
  const count = parseInt(searchParams.get('count') ?? '1');
  const res: DrawCardsResponse = await drawCards(deckId, count);
  return NextResponse.json(res);
}
