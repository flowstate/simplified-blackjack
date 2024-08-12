import { NextRequest, NextResponse } from 'next/server';

import { returnDiscardPile } from '@/lib/deck/apiDeck';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const res = await returnDiscardPile(params.deckId);
  return NextResponse.json(res);
}
