import { NextResponse } from 'next/server';

import { NewDeckResponse, openDeck } from '@/lib/deck/apiDeck';

// opt out of caching
export const dynamic = 'force-dynamic';

export async function GET() {
  const res: NewDeckResponse = await openDeck();
  return NextResponse.json(res);
}
