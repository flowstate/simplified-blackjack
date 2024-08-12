import { useApiDeckProvider } from '@/hooks/useApiDeckProvider';

import { BlackjackTable } from '@/components/blackjack/BlackjackTable';

import { BlackjackGameProvider } from '@/contexts/BlackjackGameContext';

export default function BlackjackPage() {
  const deckProvider = useApiDeckProvider();

  return (
    <BlackjackGameProvider deckProvider={deckProvider}>
      <BlackjackTable />
    </BlackjackGameProvider>
  );
}
