import { NextRequest, NextResponse } from 'next/server';

import { shuffleDeck } from '@/lib/deck/apiDeck';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const { deckId } = params;
  const res = await shuffleDeck(deckId);
  return NextResponse.json(res);
}
